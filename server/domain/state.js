//Models a turn state, builds the state messages 
module.exports = function() {
	"use strict";
	
	var userMap = {};

	var config = {"numPlayers":3,"numRows":5,"numColumns":10,"overallTimeout":30000};
	var ball = {"x":9,"y":4};

	var State = function(users) {
		this.users = users;
		this.users.forEach(function(user) {
			//users is each of the user objects
			userMap[user.id] = user;
		});
	};

	//Modifies the state
	State.prototype.modifyState = function(data) {
		Object.keys(data).forEach(function(userId) {
			var user = data[userId];
			Object.keys(user).forEach(function(playerName) {
				var playerData = user[playerName];
				userMap[userId].scheduleAction(playerName, playerData);
				//Resolves player position depending on the action
			});
		});

		//Actions will be executed secuentialy across all users.
		var allActionsExecuted = false;
		while (!allActionsExecuted) {
			Object.keys(userMap).forEach(function(userId) {
				allActionsExecuted = userMap[userId].executeNextAction();
			});
		}
		console.log("state modified");
	};

	//TODO rename StateBuilder and method to build -> this basically builds all the underlying objects to generate the message
	State.prototype.generateMessage = function() {
		var state = {
			"config": config,
			"ball": ball,
			"users": []
		};

		Object.keys(userMap).forEach(function(userId) {
			state.users.push(userMap[userId].generateMessage());
		});

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