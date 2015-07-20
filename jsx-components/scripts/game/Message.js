define(function() {
	"use strict";

	var Message = function(message, userId) {
		this.game = message.game;
		this.userId = userId;
		
		var teams = getTeams.call(this);
		this.userTeam = teams.user;
		this.rivalTeam = teams.rival;
		
		this.allPlayers = getAllPlayers.call(this);
	};

	Message.prototype.getUserTeam = function() {
		return this.userTeam;
	};

	Message.prototype.getRivalTeam = function() {
		return this.rivalTeam;
	};
	
	Message.prototype.getUserSide = function() {
		var users = this.game.users; 
		for (var i = 0; i < users.length; i++) {
			if (users[i].id === this.userId) {
				return users[i].side;
			}
		};
	};

	Message.prototype.getDimensions = function() {
		var columns = this.game.config.numColumns;
		var rows = this.game.config.numRows;

		return {"columns": columns, "rows": rows};
	};

	Message.prototype.getUserPlayerPositions = function() {
		return getPositions.call(this, this.userTeam);
	};

	Message.prototype.getRivalPlayerPositions = function() {
		return getPositions.call(this, this.rivalTeam, true);
	};
	
	Message.prototype.getBallPosition = function() {
		return this.game.ball;
	};
	
	Message.prototype.getPlayerImage = function(playerName) {
		return "";
	};

	Message.prototype.getPlayerStats = function(playerName) {
		var player = this.allPlayers[playerName];
		return (playerName) ? player.stats : {};
	};
	
	Message.prototype.getPlayerPosition = function(playerName) {
		var player = this.allPlayers[playerName];
		return player.position;
	};

	Message.prototype.getTeamScores = function() {
		var score = [];
		Object.keys(this.game.score).forEach(function(teamName) {
			score.push({teamName: teamName, goals: this.game.score[teamName]});
		}, this);

		return score;
	};
	
	Message.prototype.getPlayerIn = function(x, y) {
		var player = "";
		for (var playerName in this.allPlayers) {
			if (this.allPlayers[playerName].position.x === x && this.allPlayers[playerName].position.y === y) {
				player = playerName;
				break;
			}
		}

		return player;
	};

	Message.prototype.playerHasBall = function(playerName) {
		var playerPosition = this.getPlayerPosition(playerName);
		var ballPosition = this.getBallPosition();

		return (playerPosition.x === ballPosition.x && playerPosition.y === ballPosition.y);
	};

	Message.prototype.getOverallTimeout = function() {
		return this.game.config.overallTimeout;
	};

	function getTeams() {
		var teams = {user: {}, rival: {}};

		this.game.users.forEach(function(user) {
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
		this.game.users.forEach(function(user) {
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

	return Message;

});
