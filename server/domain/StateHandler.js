//Has states created with user objects, adduserdata when turn ends, handles the different turn states, resolves conflicts, etc

var	State = require("./State");	

var newState = {};
var previousState = {};
var users = null;

var conflict = {
	"position": {},
	"userPlayers": [{"id": "", "playerName": ""}]
}

var StateHandler = function(users) {
	this.users = users;
};

StateHandler.prototype.generateInitialState = function() {
	newState = new State(this.users);
	console.log("Generating new state: " + JSON.stringify(newState.generateMessage()));
	return newState.generateMessage();
};

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


// StateHandler.prototype.generateNewState = function(userData) {
// 	previousState = newState;

// 	var users = {};
// 	Object.keys(userData).forEach(function(userId) {
// 		users[userId] = User.convert(userData[userId]);
// 	});

// 	var conflicts = getConflicts(users);
// 	conflicts.forEach(function(conflict) {
// 		resolveConflict(users, conflict);
// 	});

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

//TODO State is a class allows you to get player positions, etc
//TODO User is a class with accessor methods
//TODO Remove Game, teams, pitch, stats, etc. Just leave User and State