define(["services/ConnectionService", "utils/ClientData", "panel/PanelOverlayController"], function(ConnectionService, ClientData, PanelOverlay) {
	"use strict";

	var GameManager = function(userAreaController) {
		this.userAreaController = userAreaController;
		this.userTeams = {};
		this.turnTimeout = null;
		this.listenForTimeoutAdjust = false;
		
		this.userAreaController.on("turn-end", this.onTurnEndedByUser, this);

		this.callbacks = {
			startTurn: startTurn.bind(this),
			render: render.bind(this),
			adjustTimeout: adjustTimeout.bind(this),
			endTurn: endTurn.bind(this)
		};
	};

	GameManager.GAME_START = "game-start";
	GameManager.NEW_TURN = "new-turn";
	GameManager.COUNTDOWN_ADJUST = "countdown-adjust";
	GameManager.COUNTDOWN_END = "countdown-end";

	GameManager.prototype.start = function() {
		PanelOverlay.show("Waiting for rival...");
		ConnectionService.subscribe(GameManager.GAME_START, this.callbacks.startTurn);
		ConnectionService.subscribe(GameManager.NEW_TURN, this.callbacks.render);
		ConnectionService.subscribe(GameManager.COUNTDOWN_ADJUST, this.callbacks.adjustTimeout);
		ConnectionService.subscribe(GameManager.COUNTDOWN_END, this.callbacks.endTurn);
		ConnectionService.send("new-user", {"name": ClientData.get("userName"), "teamName": ClientData.get("teamName")});
	
	};

	GameManager.prototype.stop = function() {
		ConnectionService.unsubscribe(GameManager.GAME_START, this.callbacks.startTurn);
		ConnectionService.unsubscribe(GameManager.NEW_TURN, this.callbacks.render);
		ConnectionService.unsubscribe(GameManager.COUNTDOWN_ADJUST, this.callbacks.adjustTimeout);
		ConnectionService.unsubscribe(GameManager.COUNTDOWN_END, this.callbacks.endTurn);
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