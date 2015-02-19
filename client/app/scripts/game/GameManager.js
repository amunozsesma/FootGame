define(function() {
	"use strict";

	var GameManager = function(userAreaController, connectionService) {
		this.userAreaController = userAreaController;
		this.userTeams = {};
		this.turnTimeout = null;
		this.connectionService = connectionService;
		
		this.userAreaController.on("turn-end", onTurnEndedByUser.bind(this))
	};

	GameManager.prototype.start = function() {
		this.connectionService.connect(onConnectionReady.bind(this));
	};

	function onConnectionReady(message) {
		startTurn.call(this, message);
	};

	function onTurnEndedByUser() {
		endTurn.call(this);
	};

	function startTurn(state) {
		this.previousState = state;

		//TODO register callback to request timeout once everything has finished loading/rendering
		this.userAreaController.loadState(state, true);
		
		//TODO this timeout will be redundant once the server calculates it
		//TODO this.connectionService.requestTurnTimeout();
		startTimeout.call(this, state.config.overallTimeout);
	};
	
	//TODO register callback on ConnectionListener for this
	function endTurn() {
		var outputState = this.userAreaController.getTurnEndResult();
		this.connectionService.sendEndOfTurnResult(this.previousState, outputState, startTurn.bind(this));
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