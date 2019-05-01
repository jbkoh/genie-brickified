#!/bin/bash
echo "Run the rest api"
cd app/http/api/
python endpoints.py &
echp "Run the genie app"
cd ../../../
npm install && npm start &
