define(["services/ConnectionService", "utils/ClientData", "panel/PanelOverlayController"], function(ConnectionService, ClientData, PanelOverlay) {
	"use strict";

	var GameManager = function(userAreaController) {
		this.userAreaController = userAreaController;
		this.userTeams = {};
		this.turnTimeout = null;
		
		this.userAreaController.on("turn-end", this.onTurnEndedByUser, this);
	};

	GameManager.prototype.start = function() {
		PanelOverlay.show("Waiting for rival...");
		
		ConnectionService.subscribe("game-start", startTurn.bind(this));
		ConnectionService.subscribe("new-turn", render.bind(this));
		ConnectionService.subscribe("countdown-adjust", adjustTimeout.bind(this));
		ConnectionService.subscribe("countdown-end", endTurn.bind(this));
		ConnectionService.send("new-user", JSON.stringify({"name": ClientData.get("userName"), "teamName": ClientData.get("teamName")}));
	
	};

	GameManager.prototype.stop = function() {
	};

	GameManager.prototype.onTurnEndedByUser = function() {
		endTurn.call(this);
	};

	function render(state) {
		PanelOverlay.show("Game starting...");
		this.state = JSON.parse(state);

		this.userAreaController.loadState(this.state, true);
		ConnectionService.send("user-ready");
		
	};
	
	function startTurn() {
		PanelOverlay.hide();
		
		//TODO remove once timeout comes from the server
		// startTimeout.call(this, this.state.config.overallTimeout);
	};

	function endTurn() {
		var outputState = this.userAreaController.getTurnEndResult();
		ConnectionService.send("turn-end", JSON.stringify(outputState));
	};

	function adjustTimeout(timeout) {
		this.userAreaController.adjustTimeout(timeout);
	};

	//TODO remove once this comes from the server
	// function startTimeout(timeout) {
	// 	if (this.turnTimeout) {
	// 		window.clearInterval(this.turnTimeout);
	// 	}

	// 	this.turnTimeout =  window.setInterval(function() {
	// 		timeout -= 50;
	// 		if (timeout === 0) {
	// 			window.clearInterval(this.turnTimeout);		
	// 			endTurn.call(this);
	// 		}
	// 		adjustTimeout.call(this, timeout);
	// 	}.bind(this), 50)

	// }

	return GameManager;

});