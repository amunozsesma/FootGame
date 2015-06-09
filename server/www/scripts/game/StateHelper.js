define(["game/ActionPosibilitiesProvider"], function(Actions) {
	"use strict";

	var StateHelper = function(inputMessage, userId) {
		this.state = inputMessage.game;
		this.userId = userId;
		
		var teams = getTeams.call(this);
		this.userTeam = teams.user;
		this.rivalTeam = teams.rival;
		
		this.allPlayers = getAllPlayers.call(this);
		this.userSide = getUserSide.call(this);

		this.outputState = this.generateOutputState({}, {});
		this.playersConfig = {};
		this.dimensions = this.getDimensions();

		this.actions = new Actions(this.userTeam, this.rivalTeam, this.userSide, this.dimensions);

	};

	StateHelper.prototype.generateOutputState = function(playerActions, playerSelectedCells) {
		var outputState = {};

		Object.keys(this.userTeam).forEach(function(playerName) {
			outputState[playerName] = {};
			outputState[playerName].action = (playerActions[playerName]) ? playerActions[playerName] : ""; 
			outputState[playerName].x = (playerSelectedCells[playerName]) ? playerSelectedCells[playerName].x : this.allPlayers[playerName].position.x;
			outputState[playerName].y = (playerSelectedCells[playerName]) ? playerSelectedCells[playerName].y : this.allPlayers[playerName].position.y;
		}.bind(this));

		return outputState;
	};

	StateHelper.prototype.getDimensions = function() {
		var columns = this.state.config.numColumns;
		var rows = this.state.config.numRows;

		return {"columns": columns, "rows": rows};
	};

	StateHelper.prototype.getUserPlayerPositions = function() {
		return getPositions.call(this, this.userTeam);
	};

	StateHelper.prototype.getRivalPlayerPositions = function() {
		return getPositions.call(this, this.rivalTeam, true);
	};
	
	StateHelper.prototype.getBallPosition = function() {
		return this.state.ball;
	};
	
	StateHelper.prototype.getPlayerImage = function(playerName) {
		return "";
	};

	StateHelper.prototype.getPlayerStats = function(playerName) {
		var player = this.allPlayers[playerName];
		return (playerName) ? player.stats : {};
	};
	
	StateHelper.prototype.getPlayerActions = function(playerName) {
		var player = this.userTeam[playerName];
		if (!player) {
			return [];
		}

		return this.actions.getActions(playerName);
	};
	
	StateHelper.prototype.getActionPosibilities = function(action, playerName) {
		return this.actions.getPosibilities(action, playerName);
	};
	
	StateHelper.prototype.setCardAction = function(playerName, card) {
		this.actions.setCard(playerName, card);
	};



	StateHelper.prototype.getPlayerPosition = function(playerName) {
		var player = this.allPlayers[playerName];
		return player.position;
	};

	StateHelper.prototype.getSelectedAction = function(playerName) {
		return (playerName) ? this.outputState[playerName].action : "";
	};

	//TODO - Has to come from the server message
	StateHelper.prototype.getTeamScores = function() {
		return this.state.score;
	};
	
	StateHelper.prototype.getPlayerIn = function(x, y) {
		var player = "";
		for (var playerName in this.allPlayers) {
			if (this.allPlayers[playerName].position.x === x && this.allPlayers[playerName].position.y === y) {
				player = playerName;
				break;
			}
		}

		return player;
	};

	StateHelper.prototype.playerHasBall = function(playerName) {
		var playerPosition = this.getPlayerPosition(playerName);
		var ballPosition = this.getBallPosition();

		return (playerPosition.x === ballPosition.x && playerPosition.y === ballPosition.y);
	};

	StateHelper.prototype.getOverallTimeout = function() {
		return this.state.config.overallTimeout;
	};

	function getTeams() {
		var teams = {user: {}, rival: {}};

		this.state.users.forEach(function(user) {
			if (user.id === this.userId) {
				teams.user = getPlayers(user.team);
			} else {
				teams.rival = getPlayers(user.team);
			}
		}, this);

		return teams;
	};
	
	function getPositions(team) {
		var positions = [];
		Object.keys(team).forEach(function(player) {
			positions.push({x: team[player].position.x, y: team[player].position.y })
		});

		return positions;
	};
	
	function getAllPlayers() {
		var players = {};
		this.state.users.forEach(function(user) {
			var teamPlayers = getPlayers(user.team);
			Object.keys(teamPlayers).forEach(function(player) {
				players[player] = teamPlayers[player];
			});
		}, this);

		return players;
	};

	function getPlayers(team) {
		var players = {};
		team.players.forEach(function(player) {
			players[player.name] = {};
			players[player.name].stats = player.stats;
			players[player.name].position = player.position;
		});

		return players;
	};

	function getUserSide() {
		var users = this.state.users; 
		for (var i = 0; i < users.length; i++) {
			if (users[i].id === this.userId) {
				return users[i].side;
			}
		};
	};

	return StateHelper;

});
