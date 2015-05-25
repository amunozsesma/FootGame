"use strict";	

var	State = require("./State")();
var UserHelper = require("./UserHelper")();


var conflict = {
	"position": {"x":0, "y":0},
	"userPlayers": [{"playerName": "", "side":"", "hasBall": ""}]
}

var StateHandler = function(users) {
	this.userHelper = new UserHelper(users);
	
	this.newState = {};
	this.previousState = {};
};

StateHandler.prototype.generateInitialState = function() {
	this.newState = new State(this.userHelper);
	return this.newState.generateMessage();
};

StateHandler.prototype.generateNewState = function(userData) {
	this.newState = new State(this.userHelper, this.previousState.ballPosition, this.previousState.score);
	this.newState.modifyState(userData);
	this.previousState = this.newState;

	return this.newState.generateMessage();
};

module.exports = StateHandler;