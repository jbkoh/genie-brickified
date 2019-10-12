const express = require('express');
const path = require('path');
const https = require("https");
const httpProxy = require('http-proxy');
const fs = require("fs");

const options = {
    //cert: fs.readFileSync('/home/renxu/fullchain.pem'),
    //key: fs.readFileSync('/home/renxu/privkey.pem')
    cert: fs.readFileSync('./app/http/api/genie_ssl.crt'),
    key: fs.readFileSync('./app/http/api/genie_ssl.key')
};
const proxy_url = 'https://0.0.0.0:5000'

const app = express();
const proxy = httpProxy.createProxyServer({});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '/build')));

app.all(/^\/api\/(.*)/, (req, res) => {
    proxy.web(req, res, { target: proxy_url });
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const port = 11001;
https.createServer(options, app).listen(port);

console.log('App is listening on port ' + port);
