# from .middlewares import login_required
import os
import pdb
import requests

import jwt
import arrow
from flask import Flask, redirect, url_for, session, request, jsonify, g, json
from flask_cors import CORS

from api import json_response, get_user, query_sparql, query_actuation, query_data, query_entity_tagset, iterate_extract, get_zone_temperature_sensor, get_occupancy_command, get_temperature_setpoint, get_thermal_power_sensor
from configs import config

API_URL = config['brickapi']['API_URL']
AUTH_URL = config['brickapi']['AUTH_URL'].format(API_URL=API_URL)
INDEX_URL = config['genie_index']

ebu3b_prefix = 'http://ucsd.edu/building/ontology/ebu3b#'
mock_prefix = 'ebu3b:EBU3B_Rm_'

production = False

REDIRECT_URI = '/oauth2callback'
cid = config['google_oauth']['client_id']
csec = config['google_oauth']['client_secret']

app = Flask(__name__)
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

@app.route('/api/log')
def login():
    return redirect(AUTH_URL)

@app.route('/api/logout')
def logout():
    resp = requests.post('https://accounts.google.com/o/oauth2/revoke',
    params={'token': session['google_token']},
    headers = {'content-type': 'application/x-www-form-urlencoded'})
    if resp.ok:
        session.pop('google_token', None)
    return redirect(INDEX_URL)

@app.route('/api/redirected')
def redirected():
    access_token = request.args['user_access_token']
    session['google_token'] = access_token
    jwt_token = get_token(access_token)
    url = API_URL + '/auth/get_userid'
    authorization = 'Bearer {0}'.format(jwt_token)
    res = requests.get(url, headers={'Authorization': authorization})
    user_email = res.json()
    return user_email

@app.route("/api/userid")
def get_userid():
    jwt_token = request.args['user_token']
    url = API_URL + '/auth/get_userid'
    authorization = 'Bearer {0}'.format(jwt_token)
    res = requests.get(url, headers={'Authorization': authorization})
    user_email = res.json()
    return user_email

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



@app.route("/api/room", methods=["GET"])
def get_all_rooms():
    user_email = request.args['user_email']
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


@app.route("/api/point/setpoint/<room>", methods=["GET"])
def get_temp_setpoint(room):
    user_email = request.args['user_email']
    uuid = get_temperature_setpoint(room, user_email)
    if (uuid == None or session['google_token'] == None):
        return json_response({'value': None})
    access_token = session['google_token']
    jwt_token = get_token(access_token)
    value = query_data(uuid, jwt_token)
    return json_response({'value': value})


@app.route("/api/point/setpoint/<room>", methods=["POST"])
def set_temp_setpoint(room):
    user_email = request.args['user_email']
    uuid = get_temperature_setpoint(room, user_email)
    if (uuid == None or session['google_token'] == None):
        return json_response({'value': None})
    req_data = request.get_json()
    access_token = session['google_token']
    jwt_token = get_token(access_token)
    query_actuation(uuid, req_data['value'], jwt_token)
    return json_response({'value': req_data['value']})


@app.route("/api/point/temp/<room>", methods=["GET"])
def get_room_temperature(room):
    user_email = request.args['user_email']
    uuid = get_zone_temperature_sensor(room, user_email)
    if (uuid == None or session['google_token'] == None):
        return json_response({'value': None})
    access_token = session['google_token']
    jwt_token = get_token(access_token)
    value = query_data(uuid, jwt_token)
    return json_response({'value': value})


@app.route("/api/point/energy/<room>", methods=["GET"])
def get_energy_usage(room):
    user_email = request.args['user_email']
    uuid = get_thermal_power_sensor(room, user_email)
    if (uuid == None or session['google_token'] == None):
        return json_response({'value': None})
    access_token = session['google_token']
    jwt_token = get_token(access_token)
    value = query_data(uuid, jwt_token)
    return json_response({'value': value})


@app.route("/api/point/status/<room>", methods=["GET"])
def get_status(room):
    user_email = request.args['user_email']
    uuid = get_occupancy_command(room, user_email)
    if (uuid == None or session['google_token'] == None):
        return json_response({'value': None})
    access_token = session['google_token']
    jwt_token = get_token(access_token)
    value = query_data(uuid, jwt_token)
    return json_response({'value': value})


@app.route("/api/point/status/<room>", methods=["POST"])
def set_status(room):
    user_email = request.args['user_email']
    uuid = get_occupancy_command(room, user_email)
    if (uuid == None or session['google_token'] == None):
        return json_response({'value': None})
    req_data = request.get_json()
    access_token = session['google_token']
    jwt_token = get_token(access_token)
    # 3 means on, 1 means off
    resp = query_actuation(uuid, req_data['value'], jwt_token)
    return json_response({'value': req_data['value']})


@app.route("/api/user", methods=["GET"])
def get_current_user():
    user_email = request.args['user_email']
    access_token = session['google_token']
    jwt_token = get_token(access_token)
    user = get_user(user_email, jwt_token)
    return json_response({'value': user})


if __name__ == '__main__':
    ssl_context = (config['ssl']['cert'], config['ssl']['key'])
    app.run(host=config['host'],
            port=config['port'],
            ssl_context=ssl_context,
            )
