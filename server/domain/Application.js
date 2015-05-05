module.exports = function(http) {
	"use strict";

	var util = require("util");				
	var io = require("socket.io")(http);
	var GameSession = require("./GameSession")(io);

	var	User = require("./UserBuilder")();
	var Team = require ("./team").Team;
	var Player = require ("./player").Player;
	var Position = require ("./position").Position;
	var Stats = require ("./stats").Stats;

	var users = [];
	var usersReadyCounter = 0;
	var endOfTurnReceived = 0;
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

	var sessions = [];
	var gameSessions = [];
	var sessionId = 0;

	var Application = function() {
	};

	Application.prototype.start = function() {
		io.on("connection", onUserConnected);
	};

	function onUserConnected(socket) {
		socket.on("disconnect", onUserDisconnected.bind(this, socket));
		socket.on(client_events.NEW_USER, onNewUser.bind(this, socket));
	};

	function onUserDisconnected(socket) {

	};

	function onNewUser(socket, data) {
		//TODO This will need to come from an ecternal class and game session will need to be created on a callback as in the 
		// future, data for the user players will come from a thirparty storage
		var user = createNewUser(data.name, data.teamName, socket);

		var session = {
			"user": user,
			"socket": socket 
		};

		sessions.push(session);
		if (sessions.length === 2) {
			//TODO this will handle every game session formed of 2 players, we can add listeners to then monitor it if we need to
			var gameSession = new GameSession(sessions, ++sessionId);
			gameSession.startGame();
			gameSessions.push(gameSession);
			sessions = [];
		}
	};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function createNewUser (userName, teamName, socket){
		var user = new User(userName, createTeam(teamName), teamName, socket.id);
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

	function getRandomNumber(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	return new Application();
};


