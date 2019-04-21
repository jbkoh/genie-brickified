from .middlewares import login_required
from flask import Flask, g
from flask_cors import CORS
import requests
import json

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

# @app.route("/kudos", methods=["GET"])
# @login_required
# def index():
#  return json_response(Kudo(g.user).find_all_kudos())


# @app.route("/kudos", methods=["POST"])
# @login_required
# def create():
#    github_repo = GithubRepoSchema().load(json.loads(request.data))
  
#    if github_repo.errors:
#      return json_response({'error': github_repo.errors}, 422)

#    kudo = Kudo(g.user).create_kudo_for(github_repo)
#    return json_response(kudo)


# @app.route("/kudo/<int:repo_id>", methods=["GET"])
# @login_required
# def show(repo_id):
#  kudo = Kudo(g.user).find_kudo(repo_id)

#  if kudo:
#    return json_response(kudo)
#  else:
#    return json_response({'error': 'kudo not found'}, 404)


# @app.route("/kudo/<int:repo_id>", methods=["PUT"])
# @login_required
# def update(repo_id):
#    github_repo = GithubRepoSchema().load(json.loads(request.data))
  
#    if github_repo.errors:
#      return json_response({'error': github_repo.errors}, 422)

#    kudo_service = Kudo(g.user)
#    if kudo_service.update_kudo_with(repo_id, github_repo):
#      return json_response(github_repo.data)
#    else:
#      return json_response({'error': 'kudo not found'}, 404)

  
# @app.route("/kudo/<int:repo_id>", methods=["DELETE"])
# @login_required
# def delete(repo_id):
#  kudo_service = Kudo(g.user)
#  if kudo_service.delete_kudo_for(repo_id):
#    return json_response({})
#  else:
#    return json_response({'error': 'kudo not found'}, 404)


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
    body = {
        'value': value
    }
    requests.post(url, json=body)


def query_entity_tagset(uuid):
    url = brick_url + api_endpoint + '/entities/{0}'.format(uuid)
    resp = requests.get(url)
    type = resp.json()["type"]
    return extract(type, brick_prefix) if type else None


def extract(s, prefix_tagset):
    return s.replace(prefix_tagset, '')


def _get_current_user():
    if(production):
        return 'ebu3b:jasonkoh'
    else:
        return 'ebu3b:jasonkoh'


def _get_hvac_zone_point(tagset):
    userkey = _get_current_user()
    q = PREFIX + """
    select ?s where {{
        {0} rdf:type brick:User .
        {0} bf:hasOffice ?office .
        ?office rdf:type brick:Room .
        ?office bf:isPartOf ?zone .
        ?zone rdf:type brick:HVAC_Zone .
        ?s bf:isPointOf ?zone .
        ?s rdf:type brick:{1} .
    }}
    """.format(userkey, tagset)
    res = query_sparql(q)['tuples']
    return extract(res[0][0], ebu3b_prefix) if res else None


def _get_vav_point(tagset):
    userkey = _get_current_user()
    q = PREFIX + """
    select ?s where {{
        {0} rdf:type brick:User .
        {0} bf:hasOffice ?office .
        ?office rdf:type brick:Room .
        ?office bf:isPartOf ?zone .
        ?zone rdf:type brick:HVAC_Zone .
        ?vav bf:feeds ?zone .
        ?vav rdf:type brick:VAV .
        ?s bf:isPointOf ?vav .
        ?s rdf:type brick:{1} .
    }}
    """.format(userkey, tagset)
    res = query_sparql(q)['tuples']
    return extract(res[0][0], ebu3b_prefix) if res else None


def get_temperature_setpoint():
    tagset = 'Zone_Temperature_Setpoint'
    return _get_vav_point(tagset)


def get_zone_temperature_sensor():
    tagset = 'Zone_Temperature_Sensor'
    return _get_hvac_zone_point(tagset)


def get_thermal_power_sensor():
    tagset = 'Thermostat_Adjust_Sensor'
    return _get_hvac_zone_point(tagset)


def get_occupancy_command():
    tagset = 'Occupancy_Command'
    return _get_vav_point(tagset)


def get_temperature():
    uuid = get_temperature_setpoint()
    return query_data(uuid)


def get_room_temperature():
    uuid = get_zone_temperature_sensor()
    return query_data(uuid)


def get_energy_usage():
    uuid = get_thermal_power_sensor()
    return query_data(uuid)


def get_status():
    uuid = get_occupancy_command()
    return query_data(uuid)


def set_status_on():
    uuid = get_occupancy_command()
    query_actuation(uuid, 3)


def set_status_off():
    uuid = get_occupancy_command()
    query_actuation(uuid, 1)


def set_temperature(temperature):
    uuid = get_temperature_setpoint()
    query_actuation(uuid, temperature)


def json_response(payload, status=200):
 return (json.dumps(payload), status, {'content-type': 'application/json'})
