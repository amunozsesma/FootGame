/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util")					
var	User = require("./user").User;	
var	State = require("./state").State;	
var Team = require ("./team").Team;
var Player = require ("./player").Player;
var Position = require ("./position").Position;
var Ball = require ("./ball").Ball;
var Stats = require ("./stats").Stats;
var Game = require ("./game").Game;
var Config = require("./config").Config;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var socket,
	users;	// Array of connected users
var usersReadyCounter = 0;

function init() {
	// Create an empty array to store users
    
users = [];

    
app.get('/', function(req, res){
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
	io.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	util.log("New user has connected: "+client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new user message
	client.on("new user", onNewUser);
    
     //User ready
    client.on ("user ready", onUserReady);
    
    client.on ("end of turn", onEndOfTurn);
    
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
    
	var newUser = createNewUser(data.name, data.teamName);
    
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
        
/*    var state = {		"config": {
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
		}*/
    
    //TODO Check IDs
    usersReadyCounter++;
    if(usersReadyCounter === 2) {
        usersReadyCounter = 0;
        io.sockets.emit("game start", {state: generateInitialGameState()});
        setTimeout(function(){io.sockets.emit("end of turn")},180000);
        
    }
}

function onEndOfTurn(data) {

    //check received end of turns from both users
    //get state from users
    //Resolve turn
    //Send new state to both users
    
    console.log(JSON.stringify(data.userState));
    user = userById(this.id);
    console.log(data.userState.TwerkinPlayer1.x);

}

function generateInitialGameState () {
    
    var config = new Config(3,5,10);
    var ball = new Ball(createRandomPosition());
    var game = new Game(users, config, ball)
    var state = new State(game);
    
    return state;
    
}


function updateGameState(game) {

    return new State(game)

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

function createNewUser (userName, teamName){
    
  
    var user = new User(userName, createTeam(teamName));
    return user;
    
}

function createTeam(teamName){

    var team = new Team(teamName, createPlayers(teamName));
    return team;

}


function createPlayers (teamName) {
    var players = [];
    var i;
    for (i=0; i< 3 ; i++) {
       var player = new Player(teamName +"_Player_" + i, createRandomPosition(), createRandomStats());      
       players.push(player);  
    }
    return players;
}
    
function createRandomStats () {

    var stats = new Stats(getRandomNumber(1,10), getRandomNumber(1,10), getRandomNumber(1,10), getRandomNumber(1,10));
    return stats;

}

function createRandomPosition () {

    var position = new Position(getRandomNumber(1,10), getRandomNumber(1,10));
    return position;

}

// TODO change this shit!!
function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


/**************************************************
** RUN THE GAME
**************************************************/
init();