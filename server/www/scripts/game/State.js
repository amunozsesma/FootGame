define(["game/Actions"], function(Actions) {
	"use strict";

	var State = function(message) {
		this.actions = new Actions(message);

		this.message = message;
		this.state = createState.call(this);

		this.selectedPlayer = "";
		this.selectedCard = null;
	};

	State.POSIBILITY_TYPE = {
		CARD: "Card",
		ACTION: "Action",
		NONE: "None"
	}

	State.prototype.getOutput = function() {
		return this.state;
	};

	function createState() {
		var state = {};
		var players = this.message.getUserTeam();

		Object.keys(players).forEach(function(playerName) {
			state[playerName] = {};
			state[playerName].action = "";
			state[playerName].card = null;
			state[playerName].x = null; 
			state[playerName].y = null;
		});

		return state;
	};

	/** State modification API */

	State.prototype.playerSelected = function(posX, posY) {
		this.selectedPlayer = this.message.getPlayerIn(posX, posY);
	};

	State.prototype.playerDeselected = function() {
		this.selectedPlayer = "";
	};
	
	/** @return posibility type */
	State.prototype.posibilitySelected = function(posX, posY) {
		var posibilityType = State.POSIBILITY_TYPE.NONE;

		// Takes into consideration if a card has been selected, maybe refactor
		if (this.selectedCard) {
			var playerName = this.message.getPlayerIn(posX, posY);
			if (this.actions.setCard(playerName, this.selectedCard)) {
				this.state[playerName].card = this.selectedCard.clone();
				this.selectedCard = null;
				posibilityType = State.POSIBILITY_TYPE.CARD;
			}
		} else if (this.selectedPlayer !== ""){
			this.state[this.selectedPlayer].x = posX;
			this.state[this.selectedPlayer].y = posY;
			posibilityType = State.POSIBILITY_TYPE.ACTION;
		}

		return posibilityType;
	};

	State.prototype.actionDeselected = function() {
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

	/** @return true if new card has been selected (this is, if there was no card previously selected) */
	State.prototype.cardSelected = function(card) {
		var isCardSelected = false;

		if (!this.selectedCard) {
			this.selectedCard = card;
			isCardSelected = true;
		}

		return isCardSelected;
	};

	State.prototype.cardDeselected = function(card) {
		this.selectedCard = null;
		Object.keys(this.state).forEach(function(playerName) {
			if (this.state[playerName].card && card.equals(this.state[playerName].card)) {
				this.state[playerName].card = null;
				this.state[playerName].x = null;
				this.state[playerName].y = null;
				this.state[playerName].action = "";
				this.actions.deselectCard(playerName, card);
			}
		}, this);
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

	State.prototype.getActionedCards = function() {
		var actionedCards = [];
		Object.keys(this.state).forEach(function(playerName) {
			if (this.state[playerName].card) {
				actionedCards.push(this.message.getPlayerPosition(playerName));
			}
		}, this);

		return actionedCards;
	};

	State.prototype.getCardsPlayedByPlayers = function() {
		var cardsPlayed = [];

		Object.keys(this.state).forEach(function(playerName) {
			var card = this.state[playerName].card;
			if (card) {
				cardsPlayed.push({card: card, playerName: playerName});
			}
		}, this);

		return cardsPlayed;
	};

	State.prototype.getCard = function() {
		if (this.selectedPlayer === "" || !this.state[this.selectedPlayer]) {
			return null;
		}

		return this.state[this.selectedPlayer].card;
	};

	return State;

});
