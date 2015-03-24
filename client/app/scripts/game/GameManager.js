define(["utils/ConnectionService"], function(ConnectionService) {
	"use strict";

	var GameManager = function(userAreaController) {
		this.userAreaController = userAreaController;
		this.userTeams = {};
		this.turnTimeout = null;
		
		this.userAreaController.on("turn-end", this.onTurnEndedByUser, this);
	};

	GameManager.prototype.start = function() {
		// ConnectionService.startGameConnection(onConnectionReady.bind(this));
		ConnectionService.subscribe("new-turn", onConnectionReady.bind(this));
	};

	GameManager.prototype.stop = function() {
	};

	function onConnectionReady(message) {
		startTurn.call(this, message);
	};

	GameManager.prototype.onTurnEndedByUser = function() {
		endTurn.call(this);
	};

	function startTurn(state) {
		this.previousState = state;

		//TODO register callback to request timeout once everything has finished loading/rendering
		this.userAreaController.loadState(state, true);
		
		//TODO this timeout will be redundant once the server calculates it
		//TODO ConnectionService.requestTurnTimeout();
		startTimeout.call(this, state.config.overallTimeout);
	};
	
	//TODO register callback on ConnectionListener for this
	function endTurn() {
		var outputState = this.userAreaController.getTurnEndResult();
		ConnectionService.sendEndOfTurnResult(this.previousState, outputState, startTurn.bind(this));
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