module.exports = function() {
	"use strict";

	var Pitch = function(ballPosition) {
		this.playerInitialPositions = {};
		this.playerMovedPositions = {};
		this.ballInitialPosition = ballPosition;
		this.ballMovedPosition = null;
		this.playerHasBall = null;
		this.team = {};
	};

	Pitch.prototype.setTeam = function(team) {
		var players = team.players;
		this.team[team.name] = [];
		players.forEach(function(player) {
			this.playerInitialPositions[player.name] = {"x": player.position.x, "y": player.position.y};
			this.team[team.name].push(player.name);
			if (samePosition(this.ballInitialPosition, player.position.x, player.position.y)) {
				this.playerHasBall = player.name;
			}
		}, this);
	};

	
	Pitch.prototype.getSide = function(teamName) {
		return (this.team[teamName].indexOf(this.playerHasBall) !== -1) ? "attacking" : "defending";
	};

	//Ball moves always before players move -> check in old position
	Pitch.prototype.moveBall = function(posX, posY) {
		this.ballMovedPosition = {"x": posX, "y": posY};
		this.playerHasBall = getPlayerIn.call(this, posX, posY);
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

	Pitch.prototype.getPlayerPosition = function(posX, posY) {
		var playerName = getPlayerIn.call(this, posX, posY);
		var playerPositions = (this.playerMovedPositions[playerName]) ? this.playerMovedPositions : this.playerInitialPositions;
		return playerPositions[playerName];

	};

	Pitch.prototype.getBallPosition = function() {
		return (!!this.ballMovedPosition) ? this.ballMovedPosition : this.ballInitialPosition;
	};

	function getPlayerIn(posX, posY) {
		for (var playerName in this.playerInitialPositions) {
			if (samePosition(this.playerInitialPositions[playerName], posX, posY)) {
				return playerName; 
			}
		}
	};

	function samePosition(position, posX, posY) {
		return (position.x === posX && position.y === posY);
	};

	return Pitch;
};

