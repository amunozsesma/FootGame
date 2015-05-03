module.exports = function(io) {
	"use strict";

	var StateHandler = require("./StateHandler");

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

	var endOfTurnReceived = 0;
	var usersNotReady = [];
	var usersOnTurnEnd = [];
	var overallTimeout = 30000;
	var endOfTurnData = {};

	var GameSession = function(sessions, sessionId) {
		this.sessionId = "GameSession_" + sessionId;

		this.users = [];
		this.state = null;
		
		sessions.forEach(function(session) {
			setHandlers.call(this, session);
			this.users.push(session.user);
		}, this);
		
		this.stateHandler = new StateHandler(this.users); 
	};

	GameSession.prototype.startGame = function() {
		this.state = this.stateHandler.generateInitialState();
		startTurn.call(this);
	};

	function setHandlers(session) {
		var socket = session.socket;
		socket.join(this.sessionId);

		socket.on(client_events.USER_READY, onUserReady.bind(this, socket));
		socket.on(client_events.TURN_END, onEndOfTurn.bind(this, socket));
	};


	function onUserReady(socket) {
		var index = usersNotReady.indexOf(socket.id);
		(index !== -1) && usersNotReady.splice(index, 1);
		if (usersNotReady.length === 0) {
			usersNotReady = [];
			this.intervalId = null;
			io.to(this.sessionId).emit(server_events.GAME_START);
			startTimeout.call(this, overallTimeout);
		};
	};

	function onEndOfTurn(socket, data) {
		var index = usersOnTurnEnd.indexOf(socket.id);
		if (index !== -1) {
			usersOnTurnEnd.splice(index, 1);
			endOfTurnData[socket.id] = data;
			console.log("Receiving endOfTurnData: " + data);
		}

		if (usersOnTurnEnd.length === 0) {
			usersOnTurnEnd = [];
			if (this.intervalId) {
				clearInterval(this.intervalId);
			}

			//this.state = this.stateHandler.generateNextState(endOfTurnData);
			this.state = this.stateHandler.generateInitialState(); 
			startTurn.call(this);
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
				io.to(this.sessionId).emit(server_events.COUNTDOWN_END);
			}
			io.to(this.sessionId).emit(server_events.COUNTDOWN_ADJUST, timeout);
		}.bind(this), 50)
	};

	function startTurn() {
		this.users.forEach(function(user) {
			usersNotReady.push(user.id);
			usersOnTurnEnd.push(user.id);
		}, this);	

		console.log("Sending new turn: " + JSON.stringify(this.state));
		io.to(this.sessionId).emit(server_events.NEW_TURN, this.state);
	};


	return GameSession;
	
};
