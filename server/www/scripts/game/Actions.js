define(function() {
	"use strict";

	var Actions = function(message) {
		this.userPlayers = message.getUserTeam();
		this.rivalPlayers = message.getRivalTeam();
		this.dimensions = message.getDimensions();
		this.side = message.getUserSide();

		this.playerCards = {};
		
		this.poibilityResolutionStrategies = {
			adyacent: adyacentPosition.bind(this),
			ownPlayers: playerPositions.bind(this, this.userPlayers),
			rivalPlayers: playerPositions.bind(this, this.rivalPlayers),
			none: noPosibilities
		}

		this.actions = {
			Pass: {resolutionStrategy: "ownPlayers", resolutionParams: null},
			Press: {resolutionStrategy: "rivalPlayers", resolutionParams: null},
			Move: {resolutionStrategy: "adyacent", resolutionParams: 1},
			Shoot: {resolutionStrategy: "none", resolutionParams: null}
		}

		this.playerActions = {};
		Object.keys(this.userPlayers).forEach(function(playerName) {
			this.playerActions[playerName] = Actions.DEFAULT_ACTIONS[this.side].slice();
		}, this);
	};

	Actions.DEFAULT_ACTIONS = {
		"attacking": ["Pass", "Shoot", "Move"],
		"defending": ["Move", "Press"]
	}

	Actions.prototype.getPosibilities = function(action, playerName) {
		var source = (this.playerCards[playerName]) ? this.playerCards[playerName] : this.actions[action];
		return this.poibilityResolutionStrategies[source.resolutionStrategy](playerName, source.resolutionParams);
	};

	Actions.prototype.getActions = function(playerName) {
		return this.playerActions[playerName];
	};

	/** @returns true if card was set, false if it was not */
	Actions.prototype.setCard = function(playerName, card) {
		if (this.playerCards[playerName]) {
			return false;
		}

		this.playerCards[playerName] = card;
		var actionToEnhance = card.actionToEnhance;
		var cardAction = card.actionName;
		var actionIndex = this.playerActions[playerName].indexOf(actionToEnhance);

		this.playerActions[playerName].splice(actionIndex, 1, cardAction);
		return true;
	};

	Actions.prototype.deselectCard = function(playerName, card) {
		this.playerCards[playerName] = null;
		var actionToEnhance = card.actionToEnhance;
		var cardAction = card.actionName;

		var actionIndex = this.playerActions[playerName].indexOf(cardAction);
		this.playerActions[playerName].splice(actionIndex, 1, actionToEnhance);
	};

	Actions.prototype.removeCard = function(playerName) {
	};

	function playerPositions(players, playerName) {
		var posibilities = [];
		Object.keys(players).forEach(function(player) {
			if (player !== playerName) {
				posibilities.push(players[player].position);
			}
		});	

		return posibilities;

	};

	function adyacentPosition(playerName, distance) {
		var distance = distance || 1;
		var posibilities = [];
		var playerPosition = this.userPlayers[playerName].position;
		var posX, posY;

		posibilities.push(playerPosition);
		for (var i = 0; i < distance; i++) {
			for (var j = 0, len = posibilities.length; j < len; j++) {
				adyacentFromPosition.call(this, posibilities[j], posibilities);
			}
		} 
		posibilities.splice(0, 1);

		return posibilities;
	};

	function adyacentFromPosition(position, selected) {
		insertIfPossible.call(this, {x: position.x + 1, y: position.y}, selected);
		insertIfPossible.call(this, {x: position.x - 1, y: position.y}, selected);
		insertIfPossible.call(this, {x: position.x, y: position.y + 1}, selected);
		insertIfPossible.call(this, {x: position.x, y: position.y - 1}, selected);
	};

	function insertIfPossible(position, selected) {
		if (position.x < this.dimensions.columns && position.x >= 0 && 
			position.y < this.dimensions.rows && position.y >= 0 && 
			!within(position, selected) ) {
			selected.push(position);
		}
	};

	function within(position, selected) {
		var result = false;
		for (var i = 0, len = selected.length; i < len; i++) {
			if(position.x === selected[i].x && position.y === selected[i].y) {
				result = true;
				break;
			}
		}
		return result;
	}

	function noPosibilities() {
		return [];
	};

	return Actions;
});