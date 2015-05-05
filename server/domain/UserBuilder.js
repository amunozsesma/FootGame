//data into message
module.exports = function() {
	"use strict";

	var UserBuilder = function(name, team, teamName, id) {
	    this.id = id;
		this.name = name;
	    this.team = team;
	    this.teamName = teamName;
	};

	UserBuilder.prototype.build = function() {
		return this;
	};

	UserBuilder.prototype.setPosition = function(playerName, x, y) {
		var player = getPlayer.call(this, playerName);
		player.position.x = x;
		player.position.y = y;
	};

	UserBuilder.prototype.getPosition = function(playerName) {
		var player = getPlayer.call(this, playerName);
		return {"x": player.position.x, "y":player.position.y};
	};

	UserBuilder.prototype.getPlayerNames = function() {
		var playerNames = [];
		this.team.players.forEach(function(player) {
			playerNames.push(player.name);
		})
		return playerNames;
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


