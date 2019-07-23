import os
import json

config_path = os.environ.get('GETNIE_BACKEND_CONFIG', None)
if not config_path:
    config_path = './configs/backend_configs.json'
config = json.load(open(config_path, 'r'))
