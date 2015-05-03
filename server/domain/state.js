//Models a turn state, builds the state messages 

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
State.prototype.setUserData = function(useData) {
	Object.keys(userData).forEach(function(userId) {
		var data = userData[usersId];
		Object.keys(data).forEach(function(playerName) {
			var playerData = data[playerName];
			userMap[userId].setPlayerPosition(playerName, playerData.x, playerDatay);
		});
	});
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

module.exports = State;