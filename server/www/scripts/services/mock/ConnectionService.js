define(["services/mock/MockStateGenerator", "config"], function(StateGenerator, config) {
	"use strict";
	function ConnectionService () {
		this.subscribers = {};
		this.timeout = 30000;
		this.intervalId = null;

		this.state = StateGenerator.getInitialState();
	};

	var events = {
		server: {
			GAME_START: "game-start",
			NEW_TURN: "new-turn",
			COUNTDOWN_ADJUST: "countdown-adjust",
			COUNTDOWN_END: "countdown-end" 
		},
		client: {
			NEW_USER: "new-user",
			USER_READY: "user-ready",
			TURN_END: "turn-end"
		}
	}

	ConnectionService.prototype.connect = function(callback) {
		callback();
	};

	ConnectionService.prototype.send = function(eventName, data) {
		switch(eventName) {
			case events.client.NEW_USER:
				this.subscribers[events.server.NEW_TURN](JSON.stringify(this.state));
				break;
			case events.client.USER_READY:
				this.subscribers[events.server.GAME_START]();
				startTimeout.call(this, this.timeout);
				break;
			case events.client.TURN_END:
				this.state = generateNewState.call(this, this.state, JSON.parse(data));
				this.subscribers[events.server.NEW_TURN](JSON.stringify(this.state));
				break;
			default:
				console.log("No actions defined for " + eventName + " in the ConnectionService.");
		}
	};

	ConnectionService.prototype.subscribe = function(eventName, callback) {
		this.subscribers[eventName] = callback;
	};

	function generateNewState(previousMessage, message) {
		var stateGenerator = new StateGenerator(previousMessage, message);
		return stateGenerator.generateState("SIMPLE_CONFLICTS");
	};

	function startTimeout(timeout) {
		var counterEndCallback = this.subscribers[events.server.COUNTDOWN_END];
		var adjustTimeoutCallback = this.subscribers[events.server.COUNTDOWN_ADJUST];

		if (this.intervalId) {
			window.clearInterval(this.intervalId);
		}

		this.intervalId =  window.setInterval(function() {
			timeout -= 50;
			if (timeout === 0) {
				window.clearInterval(this.intervalId);		
				counterEndCallback();
			}
			adjustTimeoutCallback(timeout);
		}.bind(this), 50)
	};

	return new ConnectionService(); 
});