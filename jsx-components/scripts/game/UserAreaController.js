define(["libs/Emitter", "game/StateHelper", "utils/ClientData"], function(Emitter, StateHelper, ClientData) {
	"use strict";

	var UserAreaController = function() {
		this.stateHelper = null;
	};

	Emitter.mixInto(UserAreaController);


	// State Modification API
	//loadState
	UserAreaController.prototype.setInputState = function(message) {
		this.stateHelper = new StateHelper(message, ClientData.get("userId"));
		this.stateHelper = {};
		this.trigger("load-state", this.stateHelper);
	};

	//TODO extract to different class or create timer class inside here
	UserAreaController.prototype.adjustTimeout = function(timeout) {
		this.trigger("timeout-adjustment", {"timeout":timeout, "overallTimeout":this.stateHelper.getOverallTimeout()});
	}

	UserAreaController.prototype.getOutputState = function() {
		// return this.stateHelper.generateOutputState(this.seletecActions, this.cellChosen);
		return this.stateHelper.generateOutputState();
	};
	
	// Components API

	// UserAreaController.prototype.onUserClickedTurnEnd = function() {
	UserAreaController.prototype.endTurn = function() {
		this.trigger("turn-end", this.stateHelper);
	};

	UserAreaController.prototype.posibilityClicked = function(posX, posY) {
		this.stateHelper.setPosibility(posX, posY);
		this.trigger("show-selections", this.stateHelper);
	};

	UserAreaController.prototype.emptyCellClicked = function() {
		this.stateHelper.clearSelections(posX, posY);
		this.trigger("player-unselected", this.stateHelper);
	};

	UserAreaController.prototype.playerClicked = function(posX, posY) {
		this.stateHelper.selectPlayer(posX, posY);
		this.trigger("player-selected", this.stateHelper);
	};

	UserAreaController.prototype.action = function(action) {
		this.stateHelper.setAction(action);
		this.trigger("show-posibilities", this.stateHelper);
	};

	return new UserAreaController();
});