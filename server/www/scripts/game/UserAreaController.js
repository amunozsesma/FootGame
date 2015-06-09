define(["libs/Emitter", "game/StateHelper", "utils/ClientData"], function(Emitter, StateHelper, ClientData) {
	"use strict";

	//TODO REFACTOR, invert control -> create cell array: cell[x][y] = {hasPlayer, hasBall, isPlayerSelected, isPosibility, isSelectedPosibility},
	// Proper pitch model

	//TODO this has to be single instance

	var UserAreaController = function() {
		this.stateHelper = null;

		this.selectedPlayer = "";
		this.isPlayerInSelectActionState = false;

		this.seletecActions = {};
		this.cellChosen = {};
		this.actionSelectedCallback = null;
		this.cardToBePlayed = null;
	};

	Emitter.mixInto(UserAreaController);

	UserAreaController.prototype.loadState = function(message, isInitial) {
		this.selectedPlayer = "";
		this.isPlayerInSelectActionState = false;
		this.seletecActions = {};
		this.cellChosen = {};

		this.stateHelper = new StateHelper(message, ClientData.get("userId"));

		this.trigger("player-unselected", this);
		this.trigger("load-state", this);
	};

	UserAreaController.prototype.adjustTimeout = function(timeout) {
		this.trigger("timeout-adjustment", {"timeout":timeout, "overallTimeout":this.stateHelper.getOverallTimeout()});
	}

	UserAreaController.prototype.onTimeoutExpired = function() {
		this.trigger("turn-end");
	};

	UserAreaController.prototype.onUserClickedTurnEnd = function() {
		this.trigger("turn-end");
	};

	UserAreaController.prototype.getTurnEndResult = function() {
		var outputState = this.stateHelper.generateOutputState(this.seletecActions, this.cellChosen);
		return outputState;
	};

	UserAreaController.prototype.cellClicked = function(x, y) {
		if (this.isPlayerInSelectActionState) {
			setSelectedActionInCell.call(this, x, y);
			if (this.cardToBePlayed && !this.isPlayerInSelectActionState) {
				this.stateHelper.setCardAction(this.stateHelper.getPlayerIn(x, y), this.cardToBePlayed);
				this.actionSelectedCallback();
				this.cardToBePlayed = null;
				this.actionSelectedCallback = null;
			}
		} else {
			this.trigger("player-unselected", this);
			this.selectedPlayer = this.stateHelper.getPlayerIn(x, y);
			if (this.selectedPlayer) {
				this.trigger("player-selected", this);
			}
		}
	};

	UserAreaController.prototype.actionClicked = function(action) {
		this.seletecActions[this.selectedPlayer] = action;

		if (action !== "" && action !== "Card" && action !== "Shoot") {
			this.isPlayerInSelectActionState = true;
			this.actionPosibilities = this.stateHelper.getActionPosibilities(action, this.selectedPlayer);
			this.trigger("action-clicked", this);
		} else {
			delete this.cellChosen[this.selectedPlayer];
			this.isPlayerInSelectActionState = false;
		}
		this.trigger("action-state-changed", this);
	};

	UserAreaController.prototype.cardActioned = function(card, callback) {
		this.cardToBePlayed = card;
		this.actionSelectedCallback = callback;
		this.actionPosibilities = this.getUserPlayerPositions();
		this.isPlayerInSelectActionState = true;
		this.trigger("action-clicked", this);
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

	UserAreaController.prototype.getBallPosition = function() {
		return this.stateHelper.getBallPosition();
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
	};

	UserAreaController.prototype.getActionPosibilities = function() {
		return this.actionPosibilities;
	};

	UserAreaController.prototype.getSelectActionState = function() {
		return this.isPlayerInSelectActionState; 
	};

	UserAreaController.prototype.getSelectedActionPosition = function() {
		return (this.cellChosen[this.selectedPlayer]) ? this.cellChosen[this.selectedPlayer] : null; 
	};

	UserAreaController.prototype.canPerform = function(action) {
		var result = true;
		if (!this.selectedPlayer) {
			return false;
		}

		if (action === "Pass" || action === "Shoot") {
			result = this.stateHelper.playerHasBall(this.selectedPlayer);
		}

		return result;
	};

	function setSelectedActionInCell(x, y) {
		for (var i = 0, len = this.actionPosibilities.length; i < len; i++) {
			if (this.actionPosibilities[i].x === x && this.actionPosibilities[i].y === y) {
				this.cellChosen[this.selectedPlayer] = {"x": x, "y": y};
				this.isPlayerInSelectActionState = false;
				this.trigger("action-state-changed", this);
				break;
			}
		}
	};

	return new UserAreaController();
});