# from .middlewares import login_required
from flask import Flask, g, request, json
from flask_cors import CORS
import requests
import json, copy

from datetime import datetime, timedelta

brick_url = 'http://localhost:7889'
api_endpoint = '/api/v1'
brick_version = '1.0.2'
PREFIX = """
    PREFIX ebu3b: <http://ucsd.edu/building/ontology/ebu3b#>
"""
ebu3b_prefix = 'http://ucsd.edu/building/ontology/ebu3b#'
brick_prefix = 'https://brickschema.org/schema/' + brick_version + '/Brick#'

production = False

app = Flask(__name__)
CORS(app)

def query_sparql(query):
    url = brick_url + api_endpoint + '/queries/sparql'
    headers = {
        'Content-Type': 'sparql-query',
    }
    resp = requests.post(url, data=query)
    return resp.json()


def query_data(uuid):
    url = brick_url + api_endpoint + '/data/timeseries/{0}'.format(uuid)
    begin_time = (datetime.utcnow() - timedelta(minutes=30)).strftime('%s')
    end_time = datetime.utcnow().strftime('%s')
    params = {
        'begin_time': begin_time,
        'end_time': end_time,
    }
    resp = requests.get(url, params=params)
    data = resp.json()["data"]
    if data:
        data.sort(key=lambda d:d[1], reverse=True)
        return data[0][2]
    else: 
        return None


def query_actuation(uuid, value):
    url = brick_url + api_endpoint + '/actuation/{0}'.format(uuid)
    body = { 'value': value }
    requests.post(url, json=body)


def query_entity_tagset(uuid):
    url = brick_url + api_endpoint + '/entities/{0}'.format(uuid)
    resp = requests.get(url)
    type = resp.json()["type"]
    return extract(type, brick_prefix) if type else None


def extract(s, prefix_tagset):
    return s.replace(prefix_tagset, '')


def json_model(key):
    if key == "ebu3b":
        return {
            'college': 'UCSD',
            'campus': 'Main',
            'building': 'EBU3B'
        }
    return {}

def iterate_extract(list, prefix_tagset):
    res = []
    for s in list:
        fields = extract(s[0], prefix_tagset).lower().split("_rm_")
        temp = copy.deepcopy(fields[0])
        temp['room'] = fields[1]
        res.append(temp)
    return res


def _get_current_user():
    if(production):
        return 'ebu3b:jasonkoh'
    return 'ebu3b:jasonkoh'


def _get_hvac_zone_point(tagset, room):
    userkey = _get_current_user()
    q = PREFIX + """
    select ?s where {{
        {0} rdf:type brick:User .
        {0} bf:hasOffice {1} .
        {1} rdf:type brick:Room .
        {1} bf:isPartOf ?zone .
        ?zone rdf:type brick:HVAC_Zone .
        ?s bf:isPointOf ?zone .
        ?s rdf:type brick:{2} .
    }}
    """.format(userkey, room, tagset)
    res = query_sparql(q)['tuples']
    return extract(res[0][0], ebu3b_prefix) if res else None


def _get_vav_point(tagset, room):
    userkey = _get_current_user()
    q = PREFIX + """
    select ?s where {{
        {0} rdf:type brick:User .
        {0} bf:hasOffice {1} .
        {1} rdf:type brick:Room .
        {1} bf:isPartOf ?zone .
        ?zone rdf:type brick:HVAC_Zone .
        ?vav bf:feeds ?zone .
        ?vav rdf:type brick:VAV .
        ?s bf:isPointOf ?vav .
        ?s rdf:type brick:{2} .
    }}
    """.format(userkey, room, tagset)
    res = query_sparql(q)['tuples']
    return extract(res[0][0], ebu3b_prefix) if res else None


def get_temperature_setpoint(room):
    tagset = 'Zone_Temperature_Setpoint'
    return _get_vav_point(tagset, room)


def get_zone_temperature_sensor(room):
    tagset = 'Zone_Temperature_Sensor'
    return _get_hvac_zone_point(tagset, room)


def get_thermal_power_sensor(room):
    tagset = 'Thermostat_Adjust_Sensor'
    return _get_hvac_zone_point(tagset, room)


def get_occupancy_command(room):
    tagset = 'Occupancy_Command'
    return _get_vav_point(tagset, room)


def json_response(payload, status=200):
 return (json.dumps(payload), status, {'content-type': 'application/json'})


@app.route("/room", methods=["GET"])
def get_all_rooms():
    userkey = _get_current_user()
    q = PREFIX + """
    select ?s where {{
        {0} rdf:type brick:User .
        {0} bf:hasOffice ?s .
        ?s rdf:type brick:Room .
    }}
    """.format(userkey)
    res = query_sparql(q)['tuples']
    rooms = iterate_extract(res, ebu3b_prefix) if res else []
    return json_response({'rooms': rooms})


@app.route("/point/setpoint/<room>", methods=["GET", "POST"])
def temperature_setpoint(room):
    uuid = get_temperature_setpoint(room)
    if request.method == "GET":
        value = query_data(uuid)
        return json_response({'value': value})
    req_data = request.get_json()
    query_actuation(uuid, req_data['setpoint'])
    return json_response({})


@app.route("/point/temp/<room>", methods=["GET"])
def get_room_temperature(room):
    uuid = get_zone_temperature_sensor(room)
    value = query_data(uuid)
    return json_response({'value': value})


@app.route("/point/energy/<room>", methods=["GET"])
def get_energy_usage(room):
    uuid = get_thermal_power_sensor(room)
    value = query_data(uuid)
    return json_response({'value': value})


@app.route("/point/status/<room>", methods=["GET", "POST"])
def status(room):
    uuid = get_occupancy_command(room)
    if request.method == "GET":
        value = query_data(uuid)
        return json_response({'value': value})
    req_data = request.get_json()
    # 3 means on, 1 means off
    query_actuation(uuid, req_data['status'])
    return json_response({})

if __name__ == '__main__':
    app.run()
    print("finished")
