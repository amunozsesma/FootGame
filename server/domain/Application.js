module.exports = function(http) {
	"use strict";

	var util = require("util");				
	var io = require("socket.io")(http);
	
	var	User = require("./user").User;	
	var	State = require("./state").State;	
	var Team = require ("./team").Team;
	var Player = require ("./player").Player;
	var Position = require ("./position").Position;
	var Ball = require ("./ball").Ball;
	var Stats = require ("./stats").Stats;
	var Game = require ("./game").Game;
	var Config = require("./config").Config;
	
	var users = [];
	var usersReadyCounter = 0;
	var overallTimeout = 30000;

	//TODO use constants for event names
	var server_events = {
		GAME_START: "game-start",
		NEW_TURN: "new-turn",
		COUNTDOWN_ADJUST: "countdown-adjust",
		COUNTDOWN_END: "countdown-end"
	}; 
	
	var client_events = {
		NEW_USER: "new-user",
		USER_READY: "user-ready",
		TURN_END: "turn-end"
	};

	var Application = function() {
	};

	Application.prototype.start = function() {
		this.intervalId = null;
		io.on("connection", setEventHandlers);
	};

	function setEventHandlers(socket) {
		util.log("New user has connected with socket id: " + socket.id);
		
		socket.on("disconnect", onClientDisconnect.bind(this, socket));
		socket.on(client_events.NEW_USER, onNewUser.bind(this, socket));
		socket.on(client_events.USER_READY, onUserReady.bind(this, socket));
		socket.on(client_events.TURN_END, onEndOfTurn.bind(this, socket));
	};

	function onClientDisconnect(socket) {
		util.log("User has disconnected with id: " + socket.id);

		var removeUser = userById(socket.id);

		if (!removeUser) {
			util.log("user not found: " + socket.id);
			return;
		};

		users.splice(users.indexOf(removeUser), 1);

		// Broadcast removed user to connected socket clients --> the other client does not care. 
		//TODO Remove
		socket.broadcast.emit("remove user", {id: socket.id});
	};

	function onNewUser(socket, data) {
		// Create a new user. Get name from the client. The rest is generated here.
		var newUser = createNewUser(data.name, data.teamName);
		newUser.id = socket.id;

		console.log("New user " + newUser.name, newUser.team);

		users.push(newUser);

		// Send existing users to the new user 
		//TODO we will need to send the initial state to both clients once both are connected
		var i, existingUser;
		if (users.length === 2) {
			users.forEach(function(user) {
				var state = generateInitialGameState();
				io.emit(server_events.NEW_TURN, state);
			});
		}
		
		// for (i = 0; i < users.length; i++) {
		// 	existingUser = users[i];
		// 	socket.emit(client_events.NEW_USER, {id: existingUser.id});
		// };
			
	};

	function onUserReady (socket, data) {
		//TODO Check both users ready and broadcast state instead of emit.
		// Then the client will retrieve each player by id and its state
		//var readyUser = userById(this.id);

		//TODO Check IDs
		usersReadyCounter++;
		if(usersReadyCounter === 2) {
			usersReadyCounter = 0;
			io.emit(server_events.GAME_START);
			this.intervalId = null;
			startTimeout.call(this, overallTimeout);
		}
	};

	function startTimeout(timeout) {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}

		this.intervalId =  setInterval(function() {
			timeout -= 50;
			if (timeout === 0) {
				clearInterval(this.intervalId);		
				io.emit(server_events.COUNTDOWN_END);
			}
			io.emit(server_events.COUNTDOWN_ADJUST, timeout);
		}.bind(this), 50)
	};

	function onEndOfTurn(socket, data) {
		//check received end of turns from both users
		//get state from users
		//Resolve turn
		//Send new state to both users

		console.log(JSON.stringify(data.userState));
		user = userById(socket.id);
		console.log(data.userState.TwerkinPlayer1.x);
	};

	function generateInitialGameState (id) {
		var config = new Config(3,5,10, 30000);
		var ball = new Ball(createRandomPosition());
		var game = new Game(users, config, ball)
		var state = new State(game);

		return state;
	};

	function updateGameState(game) {
		return new State(game)
	};

	function userById(id) {
		for (var i = 0; i < users.length; i++) {
			if (users[i].id == id)
				return users[i];
		};
		
		return false;
	};

	function createNewUser (userName, teamName, socket){
		var user = new User(userName, createTeam(teamName));
		return user;
	};

	function createTeam(teamName){
		var team = new Team(teamName, createPlayers(teamName));
		return team;
	};

	function createPlayers (teamName) {
		var players = [];
		var i;
		for (i=0; i< 3 ; i++) {
			var player = new Player(teamName +"_Player_" + i, createRandomPosition(), createRandomStats());      
			players.push(player);  
		}
		return players;
	};

	function createRandomStats () {
		var stats = new Stats(getRandomNumber(1,10), getRandomNumber(1,10), getRandomNumber(1,10), getRandomNumber(1,10));
		return stats;
	};

	function createRandomPosition () {
		var position = new Position(getRandomNumber(0,9), getRandomNumber(0,4));
		return position;
	};

	// TODO change this shit!!
	function getRandomNumber(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	};

	return new Application();
};

//CHANGES
//onNewUser sends initial state emitting new-turn (this is so clientes reneder the state and then send a user ready)
//when server receives onUserReady from both broadcasts game-start and starts counter
//Server sends timeout-adjust to sync both clients and countdown-end to notify timeout has expired

//TODO
//Nice to have: State generation has to be asynchronous and notify of state generation with a successCallback/errorCallbacl
//	as this information will come from a third party in the future (eg ddbb)
//User has to send turn-end when manullay ended or after receiving countdown-end. After that start again, server broadcasts new-turn with new state, etc
//End turn
