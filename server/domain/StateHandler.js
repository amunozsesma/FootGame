"use strict";	

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

	return newState.generateMessage();
};

module.exports = StateHandler;