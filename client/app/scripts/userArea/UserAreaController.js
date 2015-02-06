define(["Emitter"], function(Emitter) {
	"use strict";

	var UserAreaController = function() {
		this.stateHelper = null;
		this.modifiedState = {};

		this.selectedPlayer = "";

		//TODO remove once everythin is on modified state
		this.seletecActions = {}
	};

	Emitter.mixInto(UserAreaController);

	UserAreaController.prototype.loadStaticContext = function() {
		this.trigger("load-static-state");
	};

	UserAreaController.prototype.loadState = function(stateHelper, isInitial) {
		this.stateHelper = stateHelper;

		this.trigger("load-state", this);
	};

	UserAreaController.prototype.cellClicked = function(x, y) {
		console.log("CEll {x: " + x + ", y: " + y + "} clicked");

		this.trigger("player-unselected", this);

		this.selectedPlayer = this.stateHelper.getPlayerIn(x, y);
		if (this.selectedPlayer) {
			this.trigger("player-selected", this);
		}
	};

	UserAreaController.prototype.actionClicked = function(action) {
		console.log(this.selectedPlayer + " selected " + action);

		//TODO while selected player has an action on this map, selected player cannot change and he has to select within posibilities
		this.seletecActions[this.selectedPlayer] = action;
	};

	UserAreaController.prototype.getDimensions = function() {
		return this.stateHelper.getDimensions();
	};

	UserAreaController.prototype.getUserPlayerPositions = function() {
		return this.stateHelper.getUserPlayerPositions();
	};

	UserAreaController.prototype.getRivalPlayerPositions = function() {
		return this.stateHelper.getRivalPlayerPositions();
	};

	UserAreaController.prototype.getSelectedPlayer = function() {
		return this.selectedPlayer;
	};

	UserAreaController.prototype.getPlayerImage = function() {
		return (this.stateHelper) ? this.stateHelper.getPlayerImage(this.selectedPlayer) : "";
	};

	UserAreaController.prototype.getPlayerStats = function() {
		return this.stateHelper.getPlayerStats(this.selectedPlayer);
	};

	UserAreaController.prototype.getPlayerActions = function() {
		return this.stateHelper.getPlayerActions(this.selectedPlayer);
	};

	UserAreaController.prototype.getSelectedAction = function() {
		return (this.seletecActions[this.selectedPlayer]) ? this.seletecActions[this.selectedPlayer] : "";
	};

	UserAreaController.prototype.getTeamScores = function() {
		return this.stateHelper.getTeamScores();
	};

	UserAreaController.prototype.getSelectedPlayerPosition = function() {
		return this.stateHelper.getPlayerPosition(this.selectedPlayer);
	}

	return UserAreaController;

});