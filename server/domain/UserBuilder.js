//data into message
module.exports = function() {
	"use strict";

	var UserBuilder = function(name, team) {
	    this.id = null;
		this.name = name;
	    this.team = team;
	    this.side = "";
	};

	UserBuilder.prototype.build = function() {
		return this;
	};

	UserBuilder.prototype.isPositionSet = function(playerName) {
		var position = this.getPosition(playerName);
		return (!!position.x);
	};
	
	UserBuilder.prototype.setPosition = function(playerName, x, y) {
		var player = getPlayer.call(this, playerName);
		player.position.x = x;
		player.position.y = y;
	};

	UserBuilder.prototype.getPosition = function(playerName) {
		var player = getPlayer.call(this, playerName);
		return player.position;
	};

	UserBuilder.prototype.getPlayerNames = function() {
		var playerNames = [];
		this.team.players.forEach(function(player) {
			playerNames.push(player.name);
		})
		return playerNames;
	};

	UserBuilder.prototype.getTeamName = function() {
		return this.team.name;
	};

	UserBuilder.prototype.resetPositions = function() {
		var team = this.team.players;
		team.forEach(function(player) {
			player.position = {};
		});
	};

	UserBuilder.prototype.getSide = function() {
		return (this.side !== "") ? this.side : "defending";
	};

	UserBuilder.prototype.setSide = function(side) {
		this.side = side;
	};

	UserBuilder.prototype.getPlayerInPosition = function(posX, posY) {
		var playerName = null;
		var position = null;
		for (var i = 0, len = this.team.players.length; i < len; i++) {
			position = this.team.players[i].position;
			if (position.x === posX && position.y === posY) {
				playerName = this.team.players[i].name;
				break;
			}
		}

		return playerName;
	};

	function getPlayer(playerName) {
		var team = this.team.players;
		for (var i =0, len = team.length; i < len; i++) {
			if (team[i].name === playerName) {
				return team[i];
			}
		}
	};

	return UserBuilder;
};


