module.exports = function(http) {
	"use strict";

	var util = require("util");				
	var io = require("socket.io")(http);
	var GameSession = require("./GameSession")(io);
	var UserManager = require("./UserManager")();

	var users = [];
	var usersReadyCounter = 0;
	var endOfTurnReceived = 0;
	var overallTimeout = 30000;

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
		UserManager.getUserData(data.name, data.teamName, onUserData.bind(this, socket), onError);
	};

	function onUserData(socket, user) {
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

	function onError() {

	};

	return new Application();
};


