"use strict";

var events = {
	connection: {
		CONNECT: "connection",
		DISCONNECT: "disconnect"
	},

	client: {
		NEW_USER: "new-user",
		USER_READY: "user-ready",
		TURN_END: "turn-end"
	},

	server: {
		GAME_START: "game-start",
		NEW_TURN: "new-turn",
		COUNTDOWN_ADJUST: "countdown-adjust",
		COUNTDOWN_END: "countdown-end"
	}
};


module.exports = events;