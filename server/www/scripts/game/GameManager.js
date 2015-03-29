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
	};

	function endTurn() {
		var outputState = this.userAreaController.getTurnEndResult();
		ConnectionService.send("turn-end", JSON.stringify(outputState));
	};

	function adjustTimeout(timeout) {
		this.userAreaController.adjustTimeout(timeout);
	};

	return GameManager;
});