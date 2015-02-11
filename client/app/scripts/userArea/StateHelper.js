define(function() {
	"use strict";

	var StateHelper = function(inputMessage) {
		this.inputState = inputMessage.state;
		this.config = inputMessage.config;
		this.outputState = {};

		this.playersConfig = {};
		processState.call(this);
	};

	function processState() {
		//TODO performance: make the state map plain: {player: {1: 2}}
		this.playersConfig = getPlayersConfig.call(this);

		var userTeam = this.config.userTeam;
		this.outputState = getPlayersState.call(this, userTeam)
	};

	StateHelper.prototype.generateOutputState = function(playerActions, playerSelectedCells) {
		var outputState = {};
		var userTeam = this.config.userTeam;
		var userPlayerState = getPlayersState.call(this, userTeam, true);

		Object.keys(userPlayerState).forEach(function(playerName) {
			outputState[playerName] = {};
			outputState[playerName].action = (playerActions[playerName]) ? playerActions[playerName] : ""; 
			outputState[playerName].x = (playerSelectedCells[playerName]) ? playerSelectedCells[playerName].x : userPlayerState[playerName].x;
			outputState[playerName].y = (playerSelectedCells[playerName]) ? playerSelectedCells[playerName].y : userPlayerState[playerName].y;
		}.bind(this));

		console.log(outputState);
		return outputState;
	};

	StateHelper.prototype.getUser = function() {
		return this.config.user;
	};

	StateHelper.prototype.getDimensions = function() {
		var columns = this.config.columns;
		var rows = this.config.rows;

		return {"columns": columns, "rows": rows};
	};

	StateHelper.prototype.getUserPlayerPositions = function() {
		var userTeam = this.config.userTeam;
		return getPlayersState.call(this, userTeam, true);
	};

	StateHelper.prototype.getRivalPlayerPositions = function() {
		var rivalTeam = this.config.rivalTeam;
		return getPlayersState.call(this, rivalTeam, true);
	};

	StateHelper.prototype.getBallPosition = function() {
		return this.inputState.ball;
	};

	StateHelper.prototype.getPlayerImage = function(playerName) {
		return (playerName) ? this.playersConfig[playerName].img : "";
	};

	StateHelper.prototype.getPlayerStats = function(playerName) {
		return (playerName) ? this.playersConfig[playerName].stats : {};
	};

	StateHelper.prototype.getPlayerActions = function(playerName) {
		var userTeam = this.config.userTeam;
		var userPlayers = getPlayersState.call(this, userTeam); 
		if (Object.keys(userPlayers).indexOf(playerName) !== -1 ) {
			return this.config.actions[this.inputState.side];
		} else {
			return [];
		}
	};

	StateHelper.prototype.getPlayerPosition = function(playerName) {
		var playerPosition = {};
		var playerState = this.inputState.players[playerName];

		playerPosition.x = playerState.x;
		playerPosition.y = playerState.y;

		return playerPosition;
	};

	StateHelper.prototype.getSelectedAction = function(playerName) {
		return (playerName) ? this.outputState.players[playerName].action : "";
	};

	StateHelper.prototype.getTeamScores = function() {
		return this.inputState.scores;
	};

	StateHelper.prototype.getPlayerIn = function(x, y) {
		var player = "";
		for (var playerName in this.inputState.players) {
			if (this.inputState.players[playerName].x === x && this.inputState.players[playerName].y === y) {
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

	StateHelper.prototype.getMovePosibilities = function(playerName) {
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

	function getPlayersConfig() {
		var players = {};
		if (Object.keys(this.inputState).length === 0) {
			return null;
		}

		var userTeam = this.config.teams[this.config.userTeam];
		var rivalTeam = this.config.teams[this.config.rivalTeam];

		for (var player in userTeam) {
			players[player] = userTeam[player];
		}
		for (var player in rivalTeam) {
			players[player] = rivalTeam[player];
		}

		return players;
	};

	function getPlayersState(teamName, copyState) {
		var playersState = {};
		Object.keys(this.config.teams[teamName]).forEach(function(player) {
			playersState[player] = (copyState) ? this.inputState.players[player] : {};
		}.bind(this));

		return playersState;
	};

	return StateHelper;

});
