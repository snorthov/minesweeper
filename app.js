/*eslint-env node:true, node*/

// app.js
// This file contains the server side JavaScript code for your application.
// This sample application uses express as web application framework (http://expressjs.com/)

var express = require('express');
var app = express();

// Set up a simple static server in a well known public directory
app.use('/', express.static(__dirname + "/public"));

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');

// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);

app.listen(port, host);