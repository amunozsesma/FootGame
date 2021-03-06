define(["libs/Emitter", "game/State", "utils/ClientData", "game/Message"], function(Emitter, State, ClientData, Message) {
	"use strict";

	var UserAreaController = function() {
		this.message = null;
		this.state = null;

		this.isCardActioned = false;

		this.cardActionedOnPlayerCallback = null;
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
		switch(this.state.posibilitySelected(posX, posY)) {
			case State.POSIBILITY_TYPE.CARD:
				cardActionedOnPlayer.call(this);
				break;
			case State.POSIBILITY_TYPE.ACTION:
				this.trigger("posibility-selected", {message: this.message, state: this.state});
				break;
			default:
				break;
		}

		
	};

	UserAreaController.prototype.emptyCellClicked = function() {
		if (!this.isCardActioned) {
			this.state.playerDeselected();
			this.trigger("player-unselected", {message: this.message, state: this.state});
		} 
	};

	UserAreaController.prototype.playerClicked = function(posX, posY) {
		this.state.playerSelected(posX, posY);
		this.trigger("player-selected", {message: this.message, state: this.state});
	};

	UserAreaController.prototype.actionSelected = function(action) {
		this.state.actionSelected(action);
		this.trigger("action-selected", {message: this.message, state: this.state});
	};

	UserAreaController.prototype.actionDeselected = function() {
		this.state.actionDeselected();
		this.trigger("action-unselected", {message: this.message, state: this.state});
	};

	UserAreaController.prototype.cardDeselected = function(card) {
		this.state.cardDeselected(card);
		this.trigger("card-deselected", {message: this.message, state: this.state});
	};

	UserAreaController.prototype.cardActioned = function(card, callback) {
		if (this.state.cardSelected(card)) {
			this.isCardActioned = true;
			this.cardActionedOnPlayerCallback = callback;
			this.trigger("card-selected", {message: this.message, state: this.state});
		}
	};

	// function cardActionedOnPlayer(callback) {
	function cardActionedOnPlayer() {
		this.cardActionedOnPlayerCallback();
		this.trigger("card-actioned", {message: this.message, state: this.state});
		this.cardActionedOnPlayerCallback = null;
		this.isCardActioned = false;
	};

	return new UserAreaController();
});