define(["services/ConnectionService", "utils/ClientData", "panel/PanelOverlayController"], function(ConnectionService, ClientData, PanelOverlay) {
	"use strict";

	var GameManager = function(userAreaController) {
		this.userAreaController = userAreaController;
		this.userTeams = {};
		this.turnTimeout = null;
		this.listenForTimeoutAdjust = false;
		
		this.userAreaController.on("turn-end", this.onTurnEndedByUser, this);
	};

	GameManager.prototype.start = function() {
		PanelOverlay.show("Waiting for rival...");
		ConnectionService.subscribe("game-start", startTurn.bind(this));
		ConnectionService.subscribe("new-turn", render.bind(this));
		ConnectionService.subscribe("countdown-adjust", adjustTimeout.bind(this));
		ConnectionService.subscribe("countdown-end", endTurn.bind(this));
		ConnectionService.send("new-user", {"name": ClientData.get("userName"), "teamName": ClientData.get("teamName")});
	
	};

	GameManager.prototype.stop = function() {
	};

	GameManager.prototype.onTurnEndedByUser = function() {
		endTurn.call(this);
	};

	function render(state) {
		PanelOverlay.hide();
		this.state = state;

		//TODO show rendering in the user area controller for when we have graphics
		this.userAreaController.loadState(this.state, true);
		ConnectionService.send("user-ready");
		
	};
	
	function startTurn() {
		this.listenForTimeoutAdjust = true;
	};

	function endTurn() {
		var outputState = this.userAreaController.getTurnEndResult();
		this.listenForTimeoutAdjust = false;
		ConnectionService.send("turn-end", outputState);
	};

	function adjustTimeout(timeout) {
		if (this.listenForTimeoutAdjust) {
			this.userAreaController.adjustTimeout(timeout);
		}

	};

	return GameManager;
});