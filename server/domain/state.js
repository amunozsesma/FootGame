//Models a turn state, builds the state messages 
module.exports = function() {
	"use strict";
	
	var TeamManager = require("./TeamManager")();

	var config = {"numPlayers":3,"numRows":5,"numColumns":10,"overallTimeout":30000};
	var ball = {"x":9,"y":4};

	var State = function(users) {
		this.users = users;
		this.teams = {};

		this.users.forEach(function(user) {
			this.teams[user.id] = new TeamManager(user);
		}, this);
	};

	State.prototype.modifyState = function(data) {
		Object.keys(data).forEach(function(userId) {
			var user = data[userId];
			Object.keys(user).forEach(function(playerName) {
				var playerData = user[playerName];
				this.teams[userId].scheduleAction(playerName, playerData);
			}, this);
		}, this);

		//Actions will be executed secuentialy across all users.
		var allActionsExecuted = false;
		while (!allActionsExecuted) {
			Object.keys(this.teams).forEach(function(userId) {
				allActionsExecuted = this.teams[userId].executeNextAction();
			}, this);
		}
		console.log("state modified");
	};

	State.prototype.generateMessage = function() {
		var state = {
			"config": config,
			"ball": ball,
			"users": []
		};

		Object.keys(this.teams).forEach(function(userId) {
			state.users.push(this.teams[userId].generateMessage());
		}, this);

		return {"game": state};
	};

	return State;
};


//A modify state message: 
//{	"1HI-xnSlqhJUNXz9AAAA": 
//	{
//		"lo_Player_0":{"action":"","x":5,"y":1},
//		"lo_Player_1":{"action":"","x":9,"y":1},
//		"lo_Player_2":{"action":"","x":1,"y":3}
//	},
//	...
//}