define(function() {
	"use strict";

	var Actions = function(message) {
		this.userPlayers = message.getUserTeam();
		this.rivalPlayers = message.getRivalTeam();
		this.dimensions = message.getDimensions();
		this.side = message.getUserSide();

		this.playerCards = {};
		
		this.basicActions = {
			"Pass": playerPositions.bind(this, this.userPlayers),
			"Press": playerPositions.bind(this, this.rivalPlayers),
			"Move": adyacentPosition.bind(this),
			"Shoot": function() {return [];}
		}

		this.actions = {};
		Object.keys(this.userPlayers).forEach(function(playerName) {
			this.actions[playerName] = Actions.DEFAULT_ACTIONS[this.side].slice();
		}, this);
	};

	Actions.DEFAULT_ACTIONS = {
		"attacking": ["Pass", "Shoot", "Move", "Card"],
		"defending": ["Move", "Press", "Card"]
	}

	Actions.prototype.getPosibilities = function(action, playerName) {
		var playableAction = (this.playerCards[playerName]) ? this.playerCards[playerName].getActionToEnhance() : action;
		//TODO get enhanced parameters

		return this.basicActions[playableAction](playerName);
	};

	Actions.prototype.getActions = function(playerName) {
		return this.actions[playerName];
	};

	Actions.prototype.setCard = function(playerName, card) {
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
		var posX, posY;

		for (var i = -distance; i <= distance ; i++) {
			posX = playerPosition.x + i;
			if (i !== 0 && posX < this.dimensions.columns && posX >= 0) {
				posibilities.push({"x": posX, "y": playerPosition.y}); 
			}
		}
		for (var j = -distance; j <= distance; j++) {
			posY = playerPosition.y + j;
			if (j !== 0 && posY < this.dimensions.rows && posY >= 0) {
				posibilities.push({"x": playerPosition.x, "y": posY}); 
			}
		}

		return posibilities;

	};

	return Actions;
});