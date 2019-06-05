# from .middlewares import login_required
from flask import Flask, g, request, json
from flask_cors import CORS

from api import json_response, get_user, query_sparql, query_actuation, query_data, query_entity_tagset, iterate_extract, get_zone_temperature_sensor, get_occupancy_command, get_temperature_setpoint, get_thermal_power_sensor

ebu3b_prefix = 'http://ucsd.edu/building/ontology/ebu3b#'
# PREFIX = """
#     PREFIX ebu3b: <http://ucsd.edu/building/ontology/ebu3b#>
# """
mock_prefix = 'ebu3b:EBU3B_Rm_'

user_email = 'jbkoh@ucsd.edu'
production = False

app = Flask(__name__)
CORS(app)


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
    app.run()
