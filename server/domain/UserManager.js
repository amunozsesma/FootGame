module.exports = function() {
	"use strict";

	var UserBuilder = require("./UserBuilder")();

	var UserManager = function() {
		//init db connection
	};

	UserManager.NUM_PLAYERS = 3;

	UserManager.prototype.getUserData = function(userName, teamName, successCallback, errorCallback) {
		var team = getTeam(userName, teamName);
		successCallback(new UserBuilder(userName, team));
	};

	//TODO comes from db
	function getTeam(userName, teamName) {
		return {
			name: teamName,
			players: getPlayers(teamName)
		}
	};

	//TODO comes from db
	function getPlayers(teamName) {
		var players = [];
		for(var i = 0; i < UserManager.NUM_PLAYERS; i++) {
			players.push({
				name: teamName + "_Player_" + i,
				position: {},
				stats: {"attack": 5, "defence": 5, "speed": 5, "strength": 5}
			});
		}

		return players;
	};

	return new UserManager();
};

