import yaml
import pdb
import requests
import json

with open('app_manifest.yaml', 'r') as fp:
    app_manifest = yaml.load(fp)

with open('config.json', 'r') as fp:
    config = json.load(fp)

body = {
    'app_reg': app_manifest,
}
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + config['user_token']
}
print(app_manifest['callback_url'])

app_url = config['api_endpoint'] + '/apps'
resp = requests.post(app_url, json=body, headers=headers)
print(resp.json())
