module.exports = function() {
	"use strict";

	var UserHelper = function(users) {
		this.users = users;
		this.userBuilders = {};
		this.teams = [];
		this.players = [];
		this.teamPlayers = {};

		init.call(this);
	};

	UserHelper.prototype.getUsers = function() {
		return this.users;
	};	

	UserHelper.prototype.getTeams = function() {
		return this.teams;
	};

	UserHelper.prototype.getPlayers = function(teamName) {
		debugger;
		return this.teamPlayers[teamName];
	};

	UserHelper.prototype.getAllPlayers = function() {
		return this.players;
	};

	UserHelper.prototype.isPositionSet = function(playerName) {
		var teamName = this.getTeam(playerName);
		return this.userBuilders[teamName].isPositionSet(playerName);
	};

	UserHelper.prototype.setPosition = function(playerName, posX, posY) {
		var teamName = this.getTeam(playerName);
		this.userBuilders[teamName].setPosition(playerName, posX, posY);
	};

	UserHelper.prototype.getPosition = function(playerName) {
		var teamName = this.getTeam(playerName);
		return this.userBuilders[teamName].getPosition(playerName);
	};

	UserHelper.prototype.setSide = function(teamName, side) {
		this.userBuilders[teamName].setSide(side);
	};

	UserHelper.prototype.resetAllPositions = function() {
		Object.keys(this.userBuilders).forEach(function (playerName) {
			this.userBuilders[playerName].resetPositions();
		}, this);
	};

	UserHelper.prototype.getTeam = function(playerName) {
		for (var teamName in this.teamPlayers) {
			if (this.teamPlayers[teamName].indexOf(playerName) !== -1) {
				return teamName;
			}
		}
	};

	UserHelper.prototype.buildAllUsers = function(playerName) {
		var builtUsers = [];
		Object.keys(this.userBuilders).forEach(function (playerName) {
			builtUsers.push(this.userBuilders[playerName].build());
		}, this);

		return builtUsers;
	};

	function init() {
		this.users.forEach(function (userBuilder) {
			var teamName = userBuilder.getTeamName();
			var playerNames = userBuilder.getPlayerNames();

			this.teams.push(teamName);
			this.teamPlayers[teamName] = playerNames;
			this.userBuilders[teamName] = userBuilder;
			this.players = this.players.concat(playerNames);
		}, this);
	};

	return UserHelper;
};