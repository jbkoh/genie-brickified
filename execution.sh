#!/bin/bash
echo "Run the rest api"
cd app/http/api/
python endpoints.py &
echo "Run the genie app"
cd ../../../
npm install && npm start &
