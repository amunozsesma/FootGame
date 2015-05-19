//Has states created with user objects, adduserdata when turn ends, handles the different turn states, resolves conflicts, etc

var	State = require("./State")();
var UserHelper = require("./UserHelper")();

var newState = {};
var previousState = {};
var users = null;

var conflict = {
	"position": {"x":0, "y":0},
	"userPlayers": [{"playerName": "", "side":"", "hasBall": ""}]
}

var StateHandler = function(users) {
	this.userHelper = new UserHelper(users);
};

StateHandler.prototype.generateInitialState = function() {
	newState = new State(this.userHelper);
	return newState.generateMessage();
};

StateHandler.prototype.generateNewState = function(userData) {
	newState = new State(this.userHelper, previousState.ballPosition, previousState.score);
	newState.modifyState(userData);
	previousState = newState;

	// var conflicts = newState.getConflicts(users);
	// var conflictResolution = resolveConflicts(conflicts, previousState);

	// newState.modifyState(conflictResolution);
	return newState.generateMessage();
};


//TODO State is a class allows you to get player positions, etc
//TODO User is a class with accessor methods
//TODO Remove Game, teams, pitch, stats, etc. Just leave User and State

//A modify state message: 
//{	"1HI-xnSlqhJUNXz9AAAA": 
//	{
//		"lo_Player_0":{"action":"","x":5,"y":1},
//		"lo_Player_1":{"action":"","x":9,"y":1},
//		"lo_Player_2":{"action":"","x":1,"y":3}
//	},
//	...
//}



// function generateUserData(users) {
// 	var userData = {};
// 	users.forEach(function(user) {
// 		userData[user.id] = {};
// 		user.team.players.forEach(function(player) {
// 			userData[user.id][player.name] = {"action": "", "x": player.position.x, "y":player.position.y};
// 		});
// 	});

// 	return userData;
// };

// function getConflicts(users) {
// 	var conflicts = [];
// 	var pitchRepresentation = createPitchRepresentation(users, rows, columns);
// 	for (var x = 0, lenX = pitchRepresentation.length; x < lenX; x++) {
// 		for (var x = 0, lenY = pitchRepresentation.length[x]; y < lenY; y++) {
// 			if (pitchRepresentation[x][y].players.length > 1) {
// 				var conflict = {
// 					"position": {"x": x, "y":y},
// 					"userPlayers": pitchRepresentation[x][y].players
// 				}
// 				conflicts.push(conflict);
// 			}
// 		}
// 	}

// 	return conflicts;
// };

// function createPitchRepresentation(users, rows, columns) {
// 	var pitch = [];
// 	for (var i = 0; i < columns; i++) {
// 		pitch.push([]);
// 		for (var j = 0; j < rows; j++) {
// 			pitch[i].push({"players": []});
// 		}
// 	}

// 	Object.keys(users).forEach(function(userId) {
// 		var players = users[userId].getPlayers();
// 		players.forEach(function(player) {
// 			pitch[player.position.x][player.position.y].players.push(player);
// 		});
// 	});

// };

// function resolveConflict(users, conflict) {
// 	var players = conflict.userPlayers;
// 	for (var i = 0, len = players.length; i < len; i++) {
// 		if (hasBall(player)) {
// 			giveBall(rivalPlayer(player, players), users);
// 			setPosition(rivalPlayer(player, players), conflict.position);
// 			setPoistion
// 			break;
// 		} 
// 	}

// };


module.exports = StateHandler;