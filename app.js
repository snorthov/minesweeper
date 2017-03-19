/*eslint-env node:true, node*/

var express = require('express');
var app = express();

app.use('/', express.static(__dirname + "/public"));

var port = process.env.PORT | process.env.VCAP_APP_PORT || 5000;

app.listen(port);