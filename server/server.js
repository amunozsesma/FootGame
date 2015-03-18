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
function onSocketConnection(client) {
	util.log("New user has connected: "+client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new user message
	client.on("new user", onNewUser);
    
     //User ready
    client.on ("user ready", onUserReady)

/*	// Listen for move user message
	client.on("move user", onMoveUser);*/
};

// Socket client has disconnected
function onClientDisconnect() {
	util.log("user has disconnected: "+this.id);

	var removeUser = userById(this.id);

	// user not found
	if (!removeUser) {
		util.log("user not found: "+this.id);
		return;
	};

	// Remove user from users array
	users.splice(users.indexOf(removeUser), 1);

	// Broadcast removed user to connected socket clients
	this.broadcast.emit("remove user", {id: this.id});
};

// New user has joined
function onNewUser(data) {
	// Create a new user. Get name from the client. The rest is generated here.
	var newUser = new User(data.name, data.teamName);
    
	newUser.id = this.id;
    
    console.log("New user " + newUser.name, newUser.team);

	// Broadcast new user to clients. What data should we send?
	this.broadcast.emit("new user", {id: newUser.id});

	// Send existing users to the new user
	var i, existingUser;
	for (i = 0; i < users.length; i++) {
		existingUser = users[i];
		this.emit("new user", {id: existingUser.id});
	};
		
	// Add new user to the users array
	users.push(newUser);
};

function onUserReady (data) {
    
    //TODO Check both users ready and broadcast state instead of emit.
    // Then the client will retrieve each player by id and its state
    //var readyUser = userById(this.id);
    
    var state = {		"config": {
				"players":3,
				"rows":5,
				"columns": 10,
				"user":"alvarito",
				"userTeam": "A.D. Twerkin",
				"rivalTeam": "Culo Gordo F.C.",
				"teams": {
					"A.D. Twerkin": {
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
					},
					"Culo Gordo F.C.": {
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
					}
				},
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
				"side":"attacking",
				"ball": {"x":3,"y":2},
				"scores": {
					"A.D. Twerkin": 0,
					"Culo Gordo F.C.": 1
				}
			}
		}
    
    
    this.emit("game start", {state: state})
  
}

function createState () {

//create state here


}

// Game helper find user by ID
function userById(id) {
	var i;
	for (i = 0; i < users.length; i++) {
		if (users[i].id == id)
			return users[i];
	};
	
	return false;
};

// TODO change this shit!!
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

/**************************************************
** RUN THE GAME
**************************************************/
init();