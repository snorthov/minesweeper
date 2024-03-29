/*eslint-env node, express */

// Initialize Express
var express = require("express");
var app = express();

// Set up a simple static server for the public directory
app.use('/', express.static(__dirname + "/public"));

// Listen for requests on a port
var port = parseInt(process.argv[2], 10) || process.env.PORT || process.env.port || process.env.VCAP_APP_PORT || 4000;
var server = app.listen(port, function() {
	var address = server.address()
	console.log("Server running on port: %d", address.port);
});