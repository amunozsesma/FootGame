/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util")					
var	User = require("./user").User;	
var team = require ("./team").team;
var player = require ("./player").player;
var position = require ("./position").position;
var ball = require ("./ball").ball;
var stats = require ("./stats").stats;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connectedClients = {};
var usersReadyForTurnStart = 0;

var socket,
	users;	// Array of connected users

function init() {
	// Create an empty array to store users
    
	users = [];

	app.use(express.static(__dirname + '/www'));
	app.get('/', function(req, res){
	  res.sendFile(__dirname + '/www/index.html');
	});
	    
	app.get('/test', function(req, res){
	  res.sendfile('public/index.html');
	});

	    
	app.use(express.static('public'));

	http.listen(3000, function(){
	  console.log('listening on *:3000');
	});

	setEventHandlers();
};


var setEventHandlers = function() {
	// Socket.IO
	io.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(clientSocket) {
	console.log("New user has connected: "+ clientSocket.id);

	// Listen for client disconnected
	clientSocket.on("disconnect", onClientDisconnect);

	// Listen for new user message
	clientSocket.on("new-user", onNewUser);
    
     //User ready
    clientSocket.on("user-ready", onUserReady);

    clientSocket.on("end-turn", onUserTurnEnded);
};

// Socket client has disconnected
function onClientDisconnect() {
	console.log("user has disconnected: " + this.id);
	usersReadyForTurnStart--;
	delete connectedClients[this.id];
};

function onNewUser(data) {
	
	// Create a new user. Get name from the client. The rest is generated here.
	var data = JSON.parse(data);
	var newUser = new User(data.name, data.teamName, this);
	newUser.id = this.id;
    
    console.log("New user (name: " + newUser.name + " | teamName: " + newUser.team + ")");
    connectedClients[this.id] = newUser;
	
	// Add new user to the users array --> not neccesary
	// users.push(newUser);

	var clientsArray = Object.keys(connectedClients);
    if (clientsArray.length === 2) {
    	clientsArray.forEach(function(client, index) {
    		var user = connectedClients[client];
    		var rivalUser = connectedClients[clientsArray[Math.abs(index - 1)]];
    		sendInitialState(this, user, rivalUser);
    	}, this);
    }
};

function sendInitialState(socket, user, rivalUser) {
	var state = createState(user, rivalUser);
	user.socket.emit("new-turn", state);
};

function onUserReady (data) {
    console.log("User is ready");
    usersReadyForTurnStart++;

    if (usersReadyForTurnStart === 2) {
    	usersReadyForTurnStart = 0;
   		console.log("game start sent");
    	io.emit("game-start"); //Start counter in the server
    } 
};

function onUserTurnEnded(data) {

};

function endTurn() {
};

//Remove this, is just to select side.
var side = 0;
function createState (user, rivalUser) {
    var state = {
		"config": {
			"players":3,
			"rows":5,
			"columns": 10,
			"user":"alvarito",
			"userTeam": user.team,
			"rivalTeam": rivalUser.team,
			"teams": {},
			"actions": {
				"attacking": ["Move", "Pass", "Shoot", "Card"],
				"defending": ["Move", "Press", "Card"]
			},
			"overallTimeout":30000
		},
		"state": {
			"players": {
				"TwerkinPlayer1": {"x":3, "y":0, "action":""},
				"TwerkinPlayer2": {"x":3, "y":2, "action":""},
				"TwerkinPlayer3": {"x":3, "y":4, "action":""},
				"CuloGordoPlayer1": {"x":4, "y":0, "action":""},
				"CuloGordoPlayer2": {"x":4, "y":2, "action":""},
				"CuloGordoPlayer3": {"x":4, "y":4, "action":""}
			},
			"side": (side===0) ? "attacking" : "defending",
			"ball": {"x":3,"y":2},
			"scores": {}
		}
	};

	side++;

	state.config.teams[user.team] = {
		"TwerkinPlayer1": {
			"stats": {"ATTACK": 2, "DEFENCE": 3, "PASS": 3, "STRENGTH": 5},
			"img":"images/twerking1.jpg"
		},
		"TwerkinPlayer2": {
			"stats": {"ATTACK": 4, "DEFENCE": 1, "PASS": 5, "STRENGTH": 2}, 
			"img":"images/twerking2.jpg"
		},
		"TwerkinPlayer3": {
			"stats": {"ATTACK": 7, "DEFENCE": 1, "PASS": 9, "STRENGTH": 7}, 
			"img":"images/twerking3.jpg"
		}
	};

	state.config.teams[rivalUser.team] = {
		"CuloGordoPlayer1": {
			"stats": {"ATTACK": 3, "DEFENCE": 3, "PASS": 2, "STRENGTH": 8},
			"img":"images/culogordo1.jpg"
		},
		"CuloGordoPlayer2": {
			"stats": {"ATTACK": 2, "DEFENCE": 8, "PASS": 3, "STRENGTH": 4},
			"img":"images/culogordo2.jpg"
		},
		"CuloGordoPlayer3": {
			"stats": {"ATTACK": 7, "DEFENCE": 7, "PASS": 5, "STRENGTH": 9},
			"img":"images/culogordo3.jpg"
		}
	};

	state.state.scores[user.team] = 0;
	state.state.scores[rivalUser.team] = 0;

	return JSON.stringify(state);
};

// Game helper find user by ID
function userById(id) {
	var i;
	for (i = 0; i < users.length; i++) {
		if (users[i].id == id)
			return users[i];
	};
	
	return false;
};

/**************************************************
** RUN THE GAME
**************************************************/
init();