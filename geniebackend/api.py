# from .middlewares import login_required
import pdb
import requests
import json, copy
import arrow
from datetime import datetime, timedelta

from werkzeug import exceptions
from flask import request

from .configs import config

API_URL = config['brickapi']['API_URL']
bs_url = config['brickapi']['API_URL']
upload_url = bs_url + '/entities/upload'
sparql_url = bs_url + '/queries/sparql'
entity_url = bs_url + '/entities'
user_url = bs_url + '/users'
app_url = bs_url + '/apps'
ts_url = bs_url + '/data/timeseries'
auth_url = bs_url + '/auth'
actuation_url = bs_url + '/actuation'

brick_prefix = config['brick']['brick_prefix']
ebu3b_prefix = config['brick']['building_prefix']

cid = config['google_oauth']['client_id']
csec = config['google_oauth']['client_secret']

production = True

def parse_header_token():
    return request.headers['Authorization'][7:]

def get_token():
    user_token = parse_header_token()
    body = {
        'user_access_token': user_token,
        'client_id': cid,
        'client_secret': csec,
    }
    url = API_URL + '/auth/get_token'
    resp = requests.post(url, json=body, verify=False)
    token = resp.json()['token']
    return token

def getHeader(jwt_token):
  return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt_token,
  }

def json_response(payload, status=200):
 return (json.dumps(payload), status, {'content-type': 'application/json'})


def query_sparql(qstr):
    resp = requests.post(sparql_url,
                         headers={ 'Content-Type': 'sparql-query'},
                         data=qstr,
                         verify=False
                         )
    if resp.status_code != 200:
        return None
    else:
        return resp.json()


def query_data(uuid, app_token):
    if production:
        start_time = arrow.get().shift(minutes=-30).timestamp
        end_time = arrow.get().timestamp
    else:
        start_time = arrow.get(2019,3,1).timestamp
        end_time = arrow.get(2019,3,30).timestamp

    params = {
        'start_time': start_time,
        'end_time': end_time,
    }
    print(params)
    print(ts_url + '/' + uuid)
    resp = requests.get(ts_url + '/' + uuid,
                        params=params,
                        headers=getHeader(app_token),
                        verify=False,
                        )
    if resp.status_code == 401:
        raise exceptions.Unauthorized()
    print(resp.json())
    if resp.status_code != 200:
        return None
    data = resp.json()["data"]
    if data:
        data.sort(key=lambda d:d[1], reverse=True)
        return data[0][2]
    else: 
        return None


def query_actuation(uuid, value, app_token):
    body = { 'value': value }
    resp = requests.post(actuation_url + '/' + uuid,
                         json=body,
                         headers=getHeader(app_token),
                         verify=False,
                         )
    if resp.status_code == 401:
        raise exceptions.Unauthorized()


def query_entity_tagset(uuid, jwt_token):
    resp = requests.get(entity_url + '/' + uuid,
                        headers=getHeader(jwt_token),
                        verify=False,
                        )
    if resp.status_code == 401:
        raise exceptions.Unauthorized()
    if resp.status_code != 200:
        return None    
    return resp.json()["type"]


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
    #for s in list:
    #    fields = extract(s[0], prefix_tagset).lower().split("_rm_")
    #    temp = copy.deepcopy(json_model("ebu3b"))
    #    temp['room'] = fields[1]
    #    res.append(temp)
    for s in list:
        res.append({
            'room': s[0],
            'college': 'UCSD',
            'campus': 'Warren',
            'building': 'BLDG',
        })
    return res


def get_user(email, jwt_token):
    res = requests.get(user_url + '/' + email,
                       headers=getHeader(jwt_token),
                       verify=False,
                       )
    if res.status_code == 401:
        raise exceptions.Unauthorized()
    if res.status_code == 200:
        return res.json()
    else:
        return None


def _get_hvac_zone_point(tagset, room, userkey):
    q = """
    select ?s where {{
        <{0}> user:hasOffice {1}.
        {1} rdf:type brick:HVAC_Zone .
        #?zone rdf:type brick:HVAC_Zone .
        {1} brick:hasPoint ?s.
        ?s rdf:type brick:{2} .
    }}
    """.format(userkey, room, tagset)
    resp = query_sparql(q)
    if resp == None:
        return None
    res = resp['tuples']
    #return extract(res[0][0], ebu3b_prefix)
    return res[0][0]


def _get_vav_point(tagset, room, userkey):
    q = """
    select ?s where {{
        <{0}> user:hasOffice {1} .
        {1} rdf:type brick:HVAC_Zone .
        ?vav brick:feeds {1} .
        ?vav rdf:type brick:VAV .
        ?vav brick:hasPoint ?s .
        ?s rdf:type brick:{2} .
    }}
    """.format(userkey, room, tagset)
    resp = query_sparql(q)
    if resp == None:
        return None
    res = resp['tuples']
    return res[0][0]


def get_temperature_setpoint(room, user_email):
    tagset = 'Zone_Air_Temperature_Setpoint'
    return _get_vav_point(tagset, room, user_email)


def get_zone_temperature_sensor(room, user_email):
    tagset = 'Zone_Air_Temperature_Sensor'
    return _get_hvac_zone_point(tagset, room, user_email)


def get_thermal_power_sensor(room, user_email):
#    q = """
#    select ?s where {{
#        <{0}> user:hasOffice {1} .
#        {1} rdf:type brick:HVAC_Zone .
#        ?vav brick:feeds {1}.
#        ?vav brick:hasPoint ?s.
#        ?s a/rdfs:subClassOf* brick:Thermal_Power_Sensor .
#    }}
#    """.format(user_email, room)
    q = """
    select ?s where {{
    <{0}> user:hasOffice bldg:RM101 .
    ?vav brick:feeds {1}.
    ?vav brick:hasPoint ?s.
    ?s a brick:Thermal_Power_Sensor.
    }}
    """.format(user_email, room)
    resp = query_sparql(q)
    if resp == None:
        return None
    res = resp['tuples']
    return res[0][0]


def get_occupancy_command(room, user_email):
    tagset = 'On_Off_Command'
    return _get_vav_point(tagset, room, user_email)
