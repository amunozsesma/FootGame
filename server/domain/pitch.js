module.exports = function() {
	"use strict";

	var config = require("./Config");

	var Pitch = function(ballPosition) {
		this.playerInitialPositions = {};
		this.playerMovedPositions = {};
		this.ballInitialPosition = ballPosition;
		this.ballMovedPosition = null;
		this.playerHasBall = null;
		this.teams = {};
	};

	Pitch.STARTING_POSITION_LEFT = 0;
	Pitch.STARTING_POSITION_RIGHT = 0;

	Pitch.prototype.setTeam = function(team, startingPosition) {
		var players = team.players;
		this.teams[team.name] = [];
		players.forEach(function(player ,index) {
			this.playerInitialPositions[player.name] = (player.position.x) ? {"x": player.position.x, "y": player.position.y} : generateInitialPosition(startingPosition, index);
			this.teams[team.name].push(player.name);
			if (samePosition(this.ballInitialPosition, player.position.x, player.position.y)) {
				this.playerHasBall = player.name;
			}
		}, this);
	};

	Pitch.prototype.setScore = function(score) {
		this.score = score;
	};

	Pitch.prototype.getScore = function() {
		return this.score;
	};
	
	Pitch.prototype.getSide = function(teamName) {
		return (this.teams[teamName].indexOf(this.playerHasBall) !== -1) ? "attacking" : "defending";
	};

	//Ball moves always before players move -> check in old position
	Pitch.prototype.moveBall = function(posX, posY) {
		this.ballMovedPosition = {"x": posX, "y": posY};
		this.playerHasBall = this.getPlayerIn(posX, posY);
	};

	Pitch.prototype.movePlayer = function(playerName, posX, posY) {
		this.playerMovedPositions[playerName] = {"x": posX, "y": posY};
		if (this.hasPlayerTheBall(playerName)) {
			this.ballMovedPosition = {"x": posX, "y": posY};
		}
		if (!this.playerHasBall && samePosition(this.ballInitialPosition, posX, posY)) {
			this.playerHasBall = playerName;
		} 
	};

	Pitch.prototype.hasPlayerTheBall = function(playerName) {
		return (this.playerHasBall === playerName);
	};

	Pitch.prototype.getPlayerPosition = function(playerName) {
		var playerPositions = (this.playerMovedPositions[playerName]) ? this.playerMovedPositions : this.playerInitialPositions;
		return playerPositions[playerName];

	};

	Pitch.prototype.getBallPosition = function() {
		return (!!this.ballMovedPosition) ? this.ballMovedPosition : this.ballInitialPosition;
	};

	Pitch.prototype.getPlayerIn = function(posX, posY) {
		for (var playerName in this.playerInitialPositions) {
			if (samePosition(this.playerInitialPositions[playerName], posX, posY)) {
				return playerName; 
			}
		}
	};

	function samePosition(position, posX, posY) {
		return (position.x === posX && position.y === posY);
	};

	function generateInitialPosition(side, index) {
		var x = (side === Pitch.STARTING_POSITION_RIGHT) ? Math.floor(3*config.numColumns / 4) : Math.floor(config.numColumns / 4);
		var y = Math.ceil(index * config.numRows / config.numPlayers );
	
		return {"x": x, "y": y};
	};

	return Pitch;
};

