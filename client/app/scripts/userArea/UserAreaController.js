define(["Emitter"], function(Emitter) {
	"use strict";

	//TODO REFACTOR, invert control -> create cell array: cell[x][y] = {hasPlayer, hasBall, isPlayerSelected, isPosibility, isSelectedPosibility},
	// Proper pitch model

	var UserAreaController = function() {
		this.stateHelper = null;

		this.selectedPlayer = "";
		this.isPlayerInSelectActionState = false;

		this.seletecActions = {};
		this.cellChosen = {};
	};

	Emitter.mixInto(UserAreaController);

	UserAreaController.prototype.loadStaticContext = function() {
		this.trigger("load-static-state");
	};

	UserAreaController.prototype.loadState = function(stateHelper, isInitial) {
		this.selectedPlayer = "";
		this.isPlayerInSelectActionState = false;
		this.seletecActions = {};
		this.cellChosen = {};

		this.stateHelper = stateHelper;
		if (!isInitial) {
			console.log("-- Initial turn");
			//TODO RESOLVE -> graphics and shit / maybe set resolve mode and then set state
		}

		this.trigger("player-unselected", this);
		this.trigger("load-state", this);
	};

	UserAreaController.prototype.adjustTimeout = function(timeout) {
		//TODO this will come from the server
		this.trigger("timeout-adjustment", timeout);
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
			setChosenCell.call(this, x, y);
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
			this.trigger("action-clicked", this);
		} else {
			delete this.cellChosen[this.selectedPlayer];
			this.isPlayerInSelectActionState = false;
		}
		this.trigger("action-state-changed", this);
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
		var action = this.seletecActions[this.selectedPlayer];
		this.actionPosibilities = this.stateHelper["get" + action + "Posibilities"](this.selectedPlayer, this.cellChosen);
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

	function setChosenCell(x, y) {
		for (var i = 0, len = this.actionPosibilities.length; i < len; i++) {
			if (this.actionPosibilities[i].x === x && this.actionPosibilities[i].y === y) {
				this.cellChosen[this.selectedPlayer] = {"x": x, "y": y};
				this.isPlayerInSelectActionState = false;
				this.trigger("action-state-changed", this);
				break;
			}
		}
	};



	return UserAreaController;

});