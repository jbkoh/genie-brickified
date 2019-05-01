# from .middlewares import login_required
from flask import Flask, g, request, json
from flask_cors import CORS

from api import get_user, query_sparql, query_actuation, query_data, query_entity_tagset, iterate_extract, get_zone_temperature_sensor, get_occupancy_command, get_temperature_setpoint, get_thermal_power_sensor

ebu3b_prefix = 'http://ucsd.edu/building/ontology/ebu3b#'
# PREFIX = """
#     PREFIX ebu3b: <http://ucsd.edu/building/ontology/ebu3b#>
# """

user_email = 'jbkoh@ucsd.edu'
production = False

app = Flask(__name__)
CORS(app)


def json_response(payload, status=200):
 return (json.dumps(payload), status, {'content-type': 'application/json'})


@app.route("/room", methods=["GET"])
def get_all_rooms():
    q = """
    select ?s where {{
        <{0}> user:hasOffice ?s.
        ?s rdf:type brick:Room .
    }}
    """.format(user_email)
    res = query_sparql(q)['tuples']
    rooms = iterate_extract(res, ebu3b_prefix) if res else []
    return json_response({'rooms': rooms})


@app.route("/point/setpoint/<room>", methods=["GET"])
def get_temperature_setpoint(room):
    uuid = get_temperature_setpoint(room, user_email)
    value = query_data(uuid)
    return json_response({'value': value})


@app.route("/point/setpoint/<room>", methods=["POST"])
def set_temperature_setpoint(room):
    uuid = get_temperature_setpoint(room, user_email)
    req_data = request.get_json()
    query_actuation(uuid, req_data['setpoint'])
    return json_response({})


@app.route("/point/temp/<room>", methods=["GET"])
def get_room_temperature(room):
    uuid = get_zone_temperature_sensor(room, user_email)
    value = query_data(uuid)
    return json_response({'value': value})


@app.route("/point/energy/<room>", methods=["GET"])
def get_energy_usage(room):
    uuid = get_thermal_power_sensor(room, user_email)
    value = query_data(uuid)
    return json_response({'value': value})


@app.route("/point/status/<room>", methods=["GET"])
def get_status(room):
    uuid = get_occupancy_command(room, user_email)
    value = query_data(uuid)
    return json_response({'value': value})


@app.route("/point/status/<room>", methods=["POST"])
def set_status(room):
    uuid = get_occupancy_command(room, user_email)
    req_data = request.get_json()
    # 3 means on, 1 means off
    query_actuation(uuid, req_data['status'])
    return json_response({})


if __name__ == '__main__':
    app.run()
    print("finished")
