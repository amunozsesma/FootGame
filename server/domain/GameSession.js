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

	var overallTimeout = 30000;

	var GameSession = function(sessions, sessionId) {
		this.sessionId = "GameSession_" + sessionId;

		this.usersOnTurnEnd = [];
		this.usersNotReady = [];
		this.endOfTurnData = {};
		this.users = [];
		this.state = null;
		
		sessions.forEach(function(session) {
			//The id will be set every time we do the start turn
			var user = session.user;
			user.id = session.socket.id;
			this.users.push(session.user);
			setHandlers.call(this, session);
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
		var index = this.usersNotReady.indexOf(socket.id);
		(index !== -1) && this.usersNotReady.splice(index, 1);
		if (this.usersNotReady.length === 0) {
			this.usersNotReady = [];
			this.intervalId = null;
			io.to(this.sessionId).emit(server_events.GAME_START);
			startTimeout.call(this, overallTimeout);
		};
	};

	function onEndOfTurn(socket, data) {
		var index = this.usersOnTurnEnd.indexOf(socket.id);
		if (index !== -1) {
			this.usersOnTurnEnd.splice(index, 1);
			this.endOfTurnData[socket.id] = data;

			console.log("\n----------------------------- END OF TURN DATA (" + this.sessionId + ") -----------------------------");
			console.log(JSON.stringify(data));
			console.log("----------------------------------------------------------------------------");
		}

		if (this.usersOnTurnEnd.length === 0) {
			this.usersOnTurnEnd = [];
			if (this.intervalId) {
				clearInterval(this.intervalId);
			}

			this.state = this.stateHandler.generateNewState(this.endOfTurnData);
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
			this.usersNotReady.push(user.id);
			this.usersOnTurnEnd.push(user.id);
		}, this);	

		//TODO set users ids and send messages xxxx'ing out socket ids for each of the users' rivals.
		
		console.log("\n\n\n----------------------------- NEW TURN GENERATED (" + this.sessionId + ") -----------------------------");
		console.log(JSON.stringify(this.state));
		console.log("------------------------------------------------------------------------------");
		io.to(this.sessionId).emit(server_events.NEW_TURN, this.state);
	};


	return GameSession;
	
};
