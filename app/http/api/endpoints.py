# from .middlewares import login_required
import os
import pdb
import requests

import jwt
import arrow
from flask import Flask, redirect, url_for, session, request, jsonify, g, json
from flask_cors import CORS

from api import json_response, get_user, query_sparql, query_actuation, query_data, query_entity_tagset, iterate_extract, get_zone_temperature_sensor, get_occupancy_command, get_temperature_setpoint, get_thermal_power_sensor

ebu3b_prefix = 'http://ucsd.edu/building/ontology/ebu3b#'
mock_prefix = 'ebu3b:EBU3B_Rm_'

user_email = 'jbkoh@ucsd.edu'
production = False

PORT = 7889
APP = 'Genie'

REDIRECT_URI = '/oauth2callback'
AUTH_URL = 'https://bd-testbed.ucsd.edu:{0}/api/v1/auth/login/{1}'.format(PORT, APP)

API_URL = 'https://bd-testbed.ucsd.edu:{0}/api/v1'.format(PORT)

with open('jwtRS256.key.pub', 'r') as fp:
    jwt_public_key = fp.read()

cid = 'M35ALqsaWWLJMUy'
csec = 'LBKJDK8FzebqnSeIITOq5yE3w'

app = Flask(__name__)
#app.debug = True
app.secret_key = os.urandom(24)
CORS(app)

def get_token(user_access_token):
    body = {
        'user_access_token': user_access_token,
        'client_id': cid,
        'client_secret': csec,
    }
    url = API_URL + '/auth/get_token'
    resp = requests.post(url, json=body)
    return resp.json()['token']

@app.route('/log')
def login():
    return redirect(AUTH_URL)

@app.route('/logout')
def logout():
    session.pop('google_token', None)
    return redirect(url_for('index'))

@app.route('/redirected/')
def redirected():
    # get token
    access_token = request.args['user_access_token']
    pdb.set_trace()
    jwt_token = get_token(access_token)
    jwt_payload = jwt.decode(jwt_token, jwt_public_key, algorithms=['RS256'])

    # extract user email
    user_email = jwt_payload['user_id']

    # Get entity
#    qstr = """
#    select ?znt where {{
#        <{0}> user:hasOffice ?office.
#        ?office bf:isPartOf ?zone.
#        ?vav bf:feeds ?zone.
#        ?znt a brick:Zone_Temperature_Sensor.
#        ?znt bf:isPointOf ?vav.
#    }}
#    """.format(user_email)
    qstr = """
    select ?meter where {
        ?meter a brick:Electricity_Power_Sensor.
    }
    """
    res = requests.post(API_URL+ '/queries/sparql',
                        headers={
                            'Content-Type': 'sparql-query',
                            'Authorization': 'Bearer ' + jwt_token,
                        },
                        data=qstr,
                        )
    znt_entity = res.json()['tuples'][0][0]

    # Get timeseries data
    params = {
        'start_time': arrow.get(2019, 3, 1).timestamp,
        'end_time': arrow.get(2019, 3, 30).timestamp,
    }
    res = requests.get(API_URL + '/data/timeseries/' + znt_entity,
                       params=params,
                       headers={
                           'Content-Type': 'application/json',
                           'Authorization': 'Bearer ' + jwt_token,
                       },
                       )
    data = res.json()

    resp = {
        'email': user_email,
        'data': data,
    }

    return jsonify(resp)

@app.route(REDIRECT_URI)
def authorized():
    resp = google.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['google_token'] = (resp['access_token'], '')
    me = google.get('userinfo')
    return jsonify({"data": me.data})



@app.route("/room", methods=["GET"])
def get_all_rooms():
    q = """
    select ?s where {{
        <{0}> user:hasOffice ?s.
        ?s rdf:type brick:Room .
    }}
    """.format(user_email)
    resp = query_sparql(q)
    if resp == None:
        return json_response({'message': 'error'}, resp.status_code)
    res = resp['tuples']
    rooms = iterate_extract(res, ebu3b_prefix) if res else []
    return json_response({'rooms': rooms})


@app.route("/point/setpoint/<room>", methods=["GET"])
def get_temp_setpoint(room):
    uuid = get_temperature_setpoint(room, user_email)
    if uuid == None:
        return json_response({'value': None})
    value = query_data(uuid)
    return json_response({'value': value})


@app.route("/point/setpoint/<room>", methods=["POST"])
def set_temp_setpoint(room):
    uuid = get_temperature_setpoint(room, user_email)
    if uuid == None:
        return json_response({'value': None})
    req_data = request.get_json()
    query_actuation(uuid, req_data['value'])
    return json_response({'value': req_data['value']})


@app.route("/point/temp/<room>", methods=["GET"])
def get_room_temperature(room):
    uuid = get_zone_temperature_sensor(room, user_email)
    if uuid == None:
        return json_response({'value': None})
    value = query_data(uuid)
    return json_response({'value': value})


@app.route("/point/energy/<room>", methods=["GET"])
def get_energy_usage(room):
    uuid = get_thermal_power_sensor(room, user_email)
    if uuid == None:
        return json_response({'value': None})
    value = query_data(uuid)
    return json_response({'value': value})


@app.route("/point/status/<room>", methods=["GET"])
def get_status(room):
    uuid = get_occupancy_command(room, user_email)
    if uuid == None:
        return json_response({'value': None})
    value = query_data(uuid)
    return json_response({'value': value})


@app.route("/point/status/<room>", methods=["POST"])
def set_status(room):
    uuid = get_occupancy_command(room, user_email)
    if uuid == None:
        return json_response({'value': None})
    req_data = request.get_json()
    # 3 means on, 1 means off
    resp = query_actuation(uuid, req_data['value'])
    return json_response({'value': req_data['value']})


@app.route("/user", methods=["GET"])
def get_current_user():
    user = get_user(user_email)
    return json_response({'value': user})


if __name__ == '__main__':
    ssl_context = ('/home/renxu/fullchain.pem',
                   '/home/renxu/privkey.pem')
    app.run(host='0.0.0.0',
              port=5000,
              ssl_context=ssl_context,
           )
