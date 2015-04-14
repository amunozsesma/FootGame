var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
var Application = require("./domain/Application")(http);

function init() {
	mockMode = false;

	users = [];
	var mockProxy = function(req, res, next) {
		if (mockMode) {
			var parts = url.parse(req.url);
			var m = parts.pathname.match(/(\/scripts\/services\/)(.*Service.js)/);
			if (m) {
				console.log('Sending mock instead: ' + m[0] + ' -> ' + m[1] + 'mock/' + m[2]);
				req.url = m[1] + 'mock/' + m[2];
			}
		}
		next();
	};

	var sendIndex = function(req, res) {
		res.sendFile(__dirname + '/www/index.html');
	};

	app.use(mockProxy);
	app.use(express.static(__dirname + '/www'));
	app.get('/mock', function(req, res, next) {
		mockMode = true;
		next();
	}, sendIndex);
	app.get('/', sendIndex);

	app.get('/test', function(req, res){
	  res.sendfile('public/index.html');
	});

	http.listen(3000, function(){
	  console.log('listening on *:3000');
	});

	Application.start();
};

init();