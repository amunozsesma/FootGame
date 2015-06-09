define(function() {
	"use strict";

	var ActionPosibilitiesProvider = function(userPlayers, rivalPlayers, side, dimensions) {
		this.userPlayers = userPlayers;
		this.rivalPlayers = rivalPlayers;
		this.dimensions = dimensions;
		this.side = side;

		this.playerCards = {};
		
		this.basicActions = {
			"Pass": playerPositions.bind(this, this.userPlayers),
			"Press": playerPositions.bind(this, this.rivalPlayers),
			"Move": adyacentPosition.bind(this)
		}

		this.actions = {};
		Object.keys(this.userPlayers).forEach(function(playerName) {
			this.actions[playerName] = ActionPosibilitiesProvider.DEFAULT_ACTIONS[this.side].slice();
		}, this);
	};

	ActionPosibilitiesProvider.DEFAULT_ACTIONS = {
		"attacking": ["Pass", "Shoot", "Move", "Card"],
		"defending": ["Move", "Press", "Card"]
	}

	ActionPosibilitiesProvider.prototype.getPosibilities = function(action, playerName) {
		var playableAction = (this.playerCards[playerName]) ? this.playerCards[playerName].getActionToEnhance() : action;
		//TODO get enhanced parameters

		return this.basicActions[playableAction](playerName);
	};

	ActionPosibilitiesProvider.prototype.getActions = function(playerName) {
		return this.actions[playerName];
	};

	ActionPosibilitiesProvider.prototype.setCard = function(playerName, card) {
		this.playerCards[playerName] = card;
		var actionToEnhance = card.getActionToEnhance();
		var cardAction = card.getActionName();
		var actionIndex = this.actions[playerName].indexOf(actionToEnhance);

		this.actions[playerName].splice(actionIndex, 1, cardAction);
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

		for (var i = -distance; i <= distance ; i++) {
			if (i !== 0) {
				posibilities.push({"x": playerPosition.x + i, "y": playerPosition.y}); 
			}
		}
		for (var j = -distance; j <= distance; j++) {
			if (j !== 0) {
				posibilities.push({"x": playerPosition.x, "y": playerPosition.y + j}); 
			}
		}

		return posibilities;

	};

	return ActionPosibilitiesProvider;
});