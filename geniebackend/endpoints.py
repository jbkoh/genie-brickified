# from .middlewares import login_required
import os
import pdb
import requests

import jwt
import arrow
from flask import Flask, redirect, url_for, session, request, jsonify, g, json
from flask_cors import CORS
from werkzeug import exceptions

from .api import json_response, get_user, query_sparql, query_actuation, query_data, query_entity_tagset, iterate_extract, get_zone_temperature_sensor, get_occupancy_command, get_temperature_setpoint, get_thermal_power_sensor, API_URL, get_token, cid, csec
from .configs import config


INDEX_URL = config['genie_index']
AUTH_URL = config['brickapi']['AUTH_URL'].format(API_URL=API_URL)
ebu3b_prefix = 'http://ucsd.edu/building/ontology/ebu3b#'
mock_prefix = 'ebu3b:EBU3B_Rm_'

production = False

REDIRECT_URI = '/oauth2callback'

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app)



@app.route('/')
def hello_main():
    return 'hello Genie backend'

@app.route('/api/log')
def login():
    return redirect(AUTH_URL)

@app.route('/api/logout')
def logout():
    resp = requests.post('https://accounts.google.com/o/oauth2/revoke',
    params={'token': session['app_token']},
    headers = {'content-type': 'application/x-www-form-urlencoded'})
    if resp.ok:
        session.pop('app_token', None)
    return redirect(INDEX_URL)

@app.route('/api/redirected')
def redirected():
    access_token = request.args['user_access_token']
    body = {
        'user_access_token': access_token,
        'client_id': cid,
        'client_secret': csec,
    }
    url = API_URL + '/auth/get_token'
    resp = requests.post(url, json=body, verify=False)
    session['app_token'] = resp.json()['token']

    url = API_URL + '/auth/get_userid'
    authorization = 'Bearer {0}'.format(session['app_token'])
    res = requests.get(url, headers={'Authorization': authorization}, verify=False)
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
    raise exceptions.NotImplemented('This should not be reached.')
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
        #<{0}> user:hasOffice ?s.
        ?s rdf:type brick:HVAC_Zone .
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
    app_token = session['app_token']
    if not uuid:
        return json_response({'value': None})
    try:
        value = query_data(uuid, app_token)
        resp = json_response({'value': value})
    except exceptions.Unauthorized as e:
        resp = json_response({'value': None,
                              'status_code': 401})
    return resp


@app.route("/api/point/setpoint/<room>", methods=["POST"])
def set_temp_setpoint(room):
    user_email = request.args['user_email']
    uuid = get_temperature_setpoint(room, user_email)
    if not uuid:
        return json_response({'value': None})
    req_data = request.get_json()
    query_actuation(uuid, req_data['value'], session['app_token'])
    return json_response({'value': req_data['value']})


@app.route("/api/point/temp/<room>", methods=["GET"])
def get_room_temperature(room):
    user_email = request.args['user_email']
    uuid = get_zone_temperature_sensor(room, user_email)
    app_token = session['app_token']
    value = query_data(uuid, app_token)
    return json_response({'value': value})


@app.route("/api/point/energy/<room>", methods=["GET"])
def get_energy_usage(room):
    user_email = request.args['user_email']
    uuid = get_thermal_power_sensor(room, user_email)
    if not uuid:
        return json_response({'value': None})
    app_token = session['app_token']
    value = query_data(uuid, app_token)
    return json_response({'value': value})


@app.route("/api/point/status/<room>", methods=["GET"])
def get_status(room):
    user_email = request.args['user_email']
    uuid = get_occupancy_command(room, user_email)
    if not uuid:
        return json_response({'value': None})
    app_token = session['app_token']
    try:
        value = query_data(uuid, app_token)
        resp = json_response({'value': value})
    except exceptions.Unauthorized as e:
        resp = json_response({'value': None,
                              'status_code': 401})
    return resp


@app.route("/api/point/status/<room>", methods=["POST"])
def set_status(room):
    user_email = request.args['user_email']
    uuid = get_occupancy_command(room, user_email)
    if not uuid:
        return json_response({'value': None})
    req_data = request.get_json()
    # 3 means on, 1 means off
    resp = query_actuation(uuid, req_data['value'], session['app_token'])
    return json_response({'value': req_data['value']})


@app.route("/api/user", methods=["GET"])
def get_current_user():
    user_email = request.args['user_email']
    app_token = session['app_token']
    user = get_user(user_email, app_token)
    return json_response({'value': user})


if __name__ == '__main__':
    ssl_context = (config['ssl']['cert'], config['ssl']['key'])
    app.run(host=config['host'],
            port=config['port'],
            ssl_context=ssl_context,
            )
