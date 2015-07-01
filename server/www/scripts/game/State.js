define(["game/Actions"], function(Actions) {
	"use strict";

	var State = function(message) {
		this.actions = new Actions(message);

		this.message = message;
		this.state = createState.call(this);

		this.selectedPlayer = "";
		this.selectedCard = null;
	};

	State.prototype.getOutput = function() {
		return this.state;
	};

	function createState() {
		var state = {};
		var players = this.message.getUserTeam();

		Object.keys(players).forEach(function(playerName) {
			state[playerName] = {};
			state[playerName].action = "";
			state[playerName].x = null; 
			state[playerName].y = null;
		});

		return state;
	};

	/** State modification API */

	State.prototype.playerSelected = function(posX, posY) {
		this.selectedPlayer = this.message.getPlayerIn(posX, posY);
	};

	State.prototype.playerUnselected = function() {
		this.selectedPlayer = "";
	};
	
	State.prototype.posibilitySelected = function(posX, posY) {
		if (this.selectedPlayer === "") {
			return;
		}

		if (this.selectedCard) {
			var playerName = this.message.getPlayerIn(posX, posY);
			this.actions.setCard(playerName, this.selectedCard);
			this.selectedCard = null;
		} else {
			this.state[this.selectedPlayer].x = posX;
			this.state[this.selectedPlayer].y = posY;
		}
	};

	State.prototype.actionUnselected = function() {
		if (this.selectedPlayer === "") {
			return;
		}

		this.state[this.selectedPlayer].action = "";
		this.state[this.selectedPlayer].x = null;
		this.state[this.selectedPlayer].y = null;
	};

	State.prototype.actionSelected = function(action) {
		if (this.selectedPlayer === "") {
			return;
		}

		this.state[this.selectedPlayer].action = action;
	};

	State.prototype.cardSelected = function(card) {
		this.selectedCard = card;
	};

	/** State getters */
	
	State.prototype.getSelectedPlayer = function() {
		return this.selectedPlayer;
	};

	State.prototype.getSelectedPlayerPosition = function() {
		if (this.selectedPlayer === "") {
			return null;
		}

		return this.message.getPlayerPosition(this.selectedPlayer);
	};

	State.prototype.getCardPosibilities = function() {
		//TODO extract it form this.selectedCard
		return this.message.getUserPlayerPositions();
	};

	State.prototype.getCurrentSelections = function() {
		var selections = [];
		if (this.selectedPlayer !== "" && this.state[this.selectedPlayer] && this.state[this.selectedPlayer].action !== "") {
			var playerState = this.state[this.selectedPlayer];
			selections.push({x: playerState.x, y: playerState.y});
		}

		return selections;
	};

	State.prototype.getActionPosibilities = function() {
		if (this.selectedPlayer === "") {
			return [];
		}

		return this.actions.getPosibilities(this.state[this.selectedPlayer].action, this.selectedPlayer);
	};

	State.prototype.getPlayerActions = function() {
		if (this.selectedPlayer === "" || !this.state[this.selectedPlayer]) {
			return [];
		}

		return this.actions.getActions(this.selectedPlayer);
	};
	
	State.prototype.getSelectedAction = function() {
		if (this.selectedPlayer === "" || !this.state[this.selectedPlayer]) {
			return "";
		}

		return this.state[this.selectedPlayer].action;
	};

	return State;

});
