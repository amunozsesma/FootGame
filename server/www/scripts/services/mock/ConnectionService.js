define(["services/mock/MockStateGenerator", "config", "utils/ClientData"], function(StateGenerator, config, ClientData) {
	"use strict";
	function ConnectionService () {
		this.subscribers = {};
		this.timeout = 100000;
		this.intervalId = null;

		this.stateGenerator = new StateGenerator();

		this.id = 12345;
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
		ClientData.set("userId", this.id);
		callback();
	};

	ConnectionService.prototype.send = function(eventName, data) {
		switch(eventName) {
			case events.client.NEW_USER:
				this.userName = data.name;
				this.teamName = data.teamName;
				
				this.state = this.stateGenerator.getInitialState(this.userName, this.teamName, this.id);
				this.subscribers[events.server.NEW_TURN](this.state);
				break;
			case events.client.USER_READY:
				window.setTimeout(function() {
					this.subscribers[events.server.GAME_START]();
				}.bind(this), 0);
				// startTimeout.call(this, this.timeout);
				break;
			case events.client.TURN_END:
				window.setTimeout(function() {
					this.state = generateNewState.call(this);
					this.subscribers[events.server.NEW_TURN](this.state);
				}.bind(this), 0);
				break;
			default:
				console.log("No actions defined for " + eventName + " in the ConnectionService.");
		}
	};

	ConnectionService.prototype.subscribe = function(eventName, callback) {
		this.subscribers[eventName] = callback;
	};

	function generateNewState(previousMessage, message) {
		return this.stateGenerator.getInitialState(this.userName, this.teamName, this.id);
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