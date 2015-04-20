define(function() {
	"use strict";

	var StateHelper = function(inputMessage, userId) {
		this.state = inputMessage.game;

		var teams = getTeams.call(this, userId);
		this.userTeam = teams.user;
		this.rivalTeam = teams.rival;
		this.allPlayers = getAllPlayers.call(this);

		this.outputState = this.generateOutputState({}, {});
		this.playersConfig = {};
	};

	StateHelper.prototype.generateOutputState = function(playerActions, playerSelectedCells) {
		var outputState = {};

		this.userTeam.players.forEach(function(player) {
			var playerName = player.name
			outputState[playerName] = {};
			outputState[playerName].action = (playerActions[playerName]) ? playerActions[playerName] : ""; 
			outputState[playerName].x = (playerSelectedCells[playerName]) ? playerSelectedCells[playerName].x : this.allPlayers[playerName].x;
			outputState[playerName].y = (playerSelectedCells[playerName]) ? playerSelectedCells[playerName].y : this.allPlayers[playerName].y;
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
		return this.state.ball.position;
	};
	
	StateHelper.prototype.getPlayerImage = function(playerName) {
		return "";
	};

	StateHelper.prototype.getPlayerStats = function(playerName) {
		var player = this.allPlayers[playerName];
		return (playerName) ? player.stats : {};
	};
	
	StateHelper.prototype.getPlayerActions = function(playerName) {
		var player = this.allPlayers[playerName];
		if (!player) {
			return [];
		}

		return (player.side === "attacking") ? ["PASS", "SHOOT", "MOVE", "CARD"] : ["MOVE", "PRESS", "CARD"];
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
		return {"Team 1": 0, "Team 2": 0};
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

	StateHelper.prototype.getPassPosibilities = function(playerName) {
		var posibilities = [];
		var players = this.getUserPlayerPositions();
		Object.keys(players).forEach(function(player) {
			if (player !== playerName) {
				posibilities.push(players[player]);
			}
		});	

		return posibilities;
	};

	StateHelper.prototype.getPressPosibilities = function(playerName) {
		var posibilities = [];
		var players = this.getRivalPlayerPositions();
		Object.keys(players).forEach(function(player) {
			if (player !== playerName) {
				posibilities.push(players[player]);
			}
		});	

		return posibilities;
	};

	StateHelper.prototype.getMovePosibilities = function(playerName, selectedCells) {
		var posibilities = [];
		var playerPosition = this.getPlayerPosition(playerName);
		var dimensions = this.getDimensions();

		//TODO get movement from stats, assuming 1 at the moment // REFACTOR
		for (var i = -1; i <= 1 ; i++) {
			if (i !== 0) {
				posibilities.push({"x": playerPosition.x + i, "y": playerPosition.y}); 
			}
		}
		for (var j = -1; j <= 1; j++) {
			if (j !== 0) {
				posibilities.push({"x": playerPosition.x, "y": playerPosition.y + j}); 
			}
		}

		return posibilities;

	};
	
	StateHelper.prototype.playerHasBall = function(playerName) {
		var playerPosition = this.getPlayerPosition(playerName);
		var ballPosition = this.getBallPosition();

		return (playerPosition.x === ballPosition.x && playerPosition.y === ballPosition.y);
	};

	StateHelper.prototype.getOverallTimeout = function() {
		return this.state.config.overallTimeout;
	};

	function getTeams(id) {
		var teams = {user: {}, rival: {}};

		this.state.users.forEach(function(user) {
			if (user.id === id) {
				teams.user = user.team;
			} else {
				teams.rival = user.team;
			}
		});

		return teams;
	};
	
	function getPositions(team) {
		var positions = [];
		team.players.forEach(function(player) {
			positions.push({x: player.position.x, y: player.position.y })
		});

		return positions;
	};
	
	function getAllPlayers() {
		var players = {};
		this.state.users.forEach(function(user) {
			user.team.players.forEach(function(player) {
				players[player.name] = {};
				players[player.name].stats = player.stats;
				players[player.name].position = player.position;
				players[player.name].side = user.side;
			});
		}, this);

		return players;
	};

	return StateHelper;

});
