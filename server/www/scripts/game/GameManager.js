define(["utils/ConnectionService", "utils/ClientData"], function(ConnectionService, ClientData) {
	"use strict";

	var GameManager = function(userAreaController) {
		this.userAreaController = userAreaController;
		this.userTeams = {};
		this.turnTimeout = null;
		
		this.userAreaController.on("turn-end", this.onTurnEndedByUser, this);
	};

	GameManager.prototype.start = function() {
		ConnectionService.subscribe("game-start", startTurn.bind(this));
		ConnectionService.subscribe("new-turn", render.bind(this));
		ConnectionService.send("new-user", JSON.stringify({"name": ClientData.get("userName"), "teamName": ClientData.get("teamName")}));
		// ConnectionService.startGameConnection(onConnectionReady.bind(this));
	};

	GameManager.prototype.stop = function() {
	};

	// function onConnectionReady(message) {
	// 	// console.log("Receiving: " + message);
	// 	// state = JSON.parse(message);
	// 	startTurn.call(this, message);
	// };

	GameManager.prototype.onTurnEndedByUser = function() {
		endTurn.call(this);
	};

	function render(state) {
		this.state = JSON.parse(state);

		//TODO register callback to request timeout once everything has finished loading/rendering
		this.userAreaController.loadState(this.state, true);
		ConnectionService.send("user-ready");
		
	};
	
	function startTurn() {
		//TODO this timeout will be redundant once the server calculates it
		//TODO ConnectionService.requestTurnTimeout();
		startTimeout.call(this, this.state.config.overallTimeout);
	};

	//TODO register callback on ConnectionListener for this
	function endTurn() {
		var outputState = this.userAreaController.getTurnEndResult();
		
		//Mocks
		ConnectionService.sendEndOfTurnResult(this.state, outputState, render.bind(this));
	};


	//TODO remove once this comes from the server
	function startTimeout(timeout, stopTimeout) {
		if (this.turnTimeout) {
			window.clearInterval(this.turnTimeout);
		}

		if (stopTimeout) {
			return;
		}

		this.turnTimeout =  window.setInterval(function() {
			timeout -= 50;
			if (timeout === 0) {
				window.clearInterval(this.turnTimeout);		
				endTurn.call(this);
			}
			this.userAreaController.adjustTimeout(timeout);
		}.bind(this), 50)

	}

	return GameManager;

});