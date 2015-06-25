define(["libs/Emitter", "game/State", "utils/ClientData", "game/Message"], function(Emitter, State, ClientData, Message) {
	"use strict";

	var UserAreaController = function() {
		this.message = null;
		this.state = null;
	};

	Emitter.mixInto(UserAreaController);


	// State Modification API
	UserAreaController.prototype.setInputState = function(message) {
		this.message = new Message(message, ClientData.get("userId"));
		this.state = new State(this.message);
		
		this.trigger("load-state", this.state);
	};

	//TODO extract to different class or create timer class inside here
	UserAreaController.prototype.adjustTimeout = function(timeout) {
		this.trigger("timeout-adjustment", {"timeout":timeout, "overallTimeout":this.message.getOverallTimeout()});
	}

	UserAreaController.prototype.getOutputState = function() {
		return this.state.getOutput();
	};
	
	// Components API

	UserAreaController.prototype.endTurn = function() {
		this.trigger("turn-end", this.state);
	};

	UserAreaController.prototype.posibilityClicked = function(posX, posY) {
		this.state.posibilitySelected(posX, posY);
		this.trigger("posibility-selected", {message: this.message, state: this.state});
	};

	UserAreaController.prototype.emptyCellClicked = function() {
		this.state.playerUnselected();
		this.trigger("player-unselected", {message: this.message, state: this.state});
	};

	UserAreaController.prototype.playerClicked = function(posX, posY) {
		this.state.playerSelected(posX, posY);
		this.trigger("player-selected", {message: this.message, state: this.state});
	};

	UserAreaController.prototype.actionSelected = function(action) {
		this.state.actionSelected(action);
		this.trigger("action-selected", {message: this.message, state: this.state});
	};

	UserAreaController.prototype.actionUnselected = function() {
		this.state.actionUnselected(action);
		this.trigger("action-unselected", {message: this.message, state: this.state});
	};

	UserAreaController.prototype.cardActioned = function(card, callback) {
		this.state.cardSelected(card);

		var playerSelectedHandler = onPlayerSelected.bind(this, callback, playerSelectedHandler);
		this.on("posibility-selected", playerSelectedHandler);
		this.trigger("card-selected", {message: this.message, state: this.state});
	};

	function onPlayerSelected(callback, handler) {
		callback();
		this.off("posibility-selected", handler);
	};

	return new UserAreaController();
});