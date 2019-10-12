import os
import pdb
import requests

import jwt
import arrow
from flask import Flask, redirect, url_for, session, request, jsonify

# PORT = 9001
PORT = 9002
APP = 'testapp'

REDIRECT_URI = '/oauth2callback'
AUTH_URL = 'https://bd-testbed.ucsd.edu:{0}/api/v1/auth/login/{1}'.format(PORT, APP)

API_URL = 'https://bd-testbed.ucsd.edu:{0}/api/v1'.format(PORT)

with open('jwtRS256.key.pub', 'r') as fp:
    jwt_public_key = fp.read()

cid = 'M35ALqsaWWLJMUy'
csec = 'LBKJDK8FzebqnSeIITOq5yE3w'

app = Flask(__name__)
app.debug = True
app.secret_key = os.urandom(24)

def get_token(user_access_token):
    body = {
        'user_access_token': user_access_token,
        'client_id': cid,
        'client_secret': csec,
    }
    url = API_URL + '/auth/get_token'
    resp = requests.post(url, json=body)
    return resp.json()['token']

@app.route('/')
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

if __name__ == '__main__':
    ssl_context = ('/home/renxu/fullchain.pem',
                   '/home/renxu/privkey.pem')
    app.run(host='0.0.0.0',
            port=6000,
            ssl_context=ssl_context,
            )
