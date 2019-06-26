# from .middlewares import login_required
import requests
import json, copy
import arrow

from datetime import datetime, timedelta

bs_url = 'https://bd-testbed.ucsd.edu:7889/api/v1'
upload_url = bs_url + '/entities/upload'
sparql_url = bs_url + '/queries/sparql'
entity_url = bs_url + '/entities'
user_url = bs_url + '/users'
app_url = bs_url + '/apps'
ts_url = bs_url + '/data/timeseries'
auth_url = bs_url + '/auth'
actuation_url = bs_url + '/actuation'

brick_version = '1.0.2'
brick_prefix = 'https://brickschema.org/schema/' + brick_version + '/Brick#'
ebu3b_prefix = 'http://ucsd.edu/building/ontology/ebu3b#'
# PREFIX = """
#     PREFIX ebu3b: <http://ucsd.edu/building/ontology/ebu3b#>
# """

production = False


#with open('master_jwt_token', 'r') as fp:
with open('genie_master_token', 'r') as fp:
#with open('data_admin_jwt_token', 'r') as fp:
#with open('VEnergy_master_token', 'r') as fp:
    jwt_token = fp.read()

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + jwt_token,
}

def json_response(payload, status=200):
 return (json.dumps(payload), status, {'content-type': 'application/json'})


def query_sparql(qstr):
    resp = requests.post(sparql_url,
                        headers={ 'Content-Type': 'sparql-query'},
                        data=qstr
                        )
    if resp.status_code != 200:
        return None
    else:
        return resp.json()


def query_data(uuid):
    if(production):
        start_time = (datetime.utcnow() - timedelta(minutes=30)).strftime('%s')
        end_time = datetime.utcnow().strftime('%s')
    else:
        start_time = arrow.get(2019,3,1).timestamp
        end_time = arrow.get(2019,3,30).timestamp

    params = {
        'start_time': start_time,
        'end_time': end_time,
    }
    resp = requests.get(ts_url + '/' + uuid,
                        params=params,
                        headers=headers,
                        )
    if resp.status_code != 200:
        return None
    data = resp.json()["data"]
    if data:
        data.sort(key=lambda d:d[1], reverse=True)
        return data[0][2]
    else: 
        return None


def query_actuation(uuid, value):
    body = { 'value': value }
    resp = requests.post(actuation_url + '/' + uuid, json=body, headers=headers)


def query_entity_tagset(uuid):
    resp = requests.get(entity_url + '/' + uuid, headers=headers)    
    if resp.status_code != 200:
        return None    
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
        temp = copy.deepcopy(json_model("ebu3b"))
        temp['room'] = fields[1]
        res.append(temp)
    return res


def get_user(email):
    res = requests.get(user_url + '/' + email, headers=headers)
    if res.status_code == 200:
        return res.json()
    else:
        return None


def _get_hvac_zone_point(tagset, room, userkey):
    q = """
    select ?s where {{
        ?user user:hasEmail "{0}" .
        ?user user:hasOffice {1} .
        {1} rdf:type brick:Room .
        {1} bf:isPartOf ?zone .
        ?zone rdf:type brick:HVAC_Zone .
        ?s bf:isPointOf ?zone .
        ?s rdf:type brick:{2} .
    }}
    """.format(userkey, room, tagset)
    resp = query_sparql(q)
    if resp == None:
        return None
    res = resp['tuples']
    return extract(res[0][0], ebu3b_prefix) if res else None


def _get_vav_point(tagset, room, userkey):
    q = """
    select ?s where {{
        ?user user:hasEmail "{0}" .
        ?user user:hasOffice {1} .
        {1} rdf:type brick:Room .
        {1} bf:isPartOf ?zone .
        ?zone rdf:type brick:HVAC_Zone .
        ?vav bf:feeds ?zone .
        ?vav rdf:type brick:VAV .
        ?s bf:isPointOf ?vav .
        ?s rdf:type brick:{2} .
    }}
    """.format(userkey, room, tagset)
    resp = query_sparql(q)
    if resp == None:
        return None
    res = resp['tuples']
    return extract(res[0][0], ebu3b_prefix) if res else None


def get_temperature_setpoint(room, user_email):
    tagset = 'Zone_Temperature_Setpoint'
    return _get_vav_point(tagset, room, user_email)


def get_zone_temperature_sensor(room, user_email):
    tagset = 'Zone_Temperature_Sensor'
    return _get_hvac_zone_point(tagset, room, user_email)


def get_thermal_power_sensor(room, user_email):
    q = """
    select ?s where {{
        ?user user:hasEmail "{0}" .
        ?user user:hasOffice {1} .
        {1} rdf:type brick:Room .
        {1} bf:isPartOf ?zone .
        ?zone rdf:type brick:HVAC_Zone .
        ?s bf:isPointOf ?zone .
        ?s a/rdfs:subClassOf* brick:Power_Sensor .
    }}
    """.format(user_email, room)
    resp = query_sparql(q)
    if resp == None:
        return None
    res = resp['tuples']
    return extract(res[0][0], ebu3b_prefix) if res else None


def get_occupancy_command(room, user_email):
    tagset = 'Occupancy_Command'
    return _get_vav_point(tagset, room, user_email)
