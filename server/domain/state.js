//Models a turn state, builds the state messages 
module.exports = function() {
	"use strict";
	
	var TeamActionsManager = require("./TeamActionsManager")();
	var Pitch = require("./Pitch")();
	var config = require("./Config");


	var State = function(userHelper, ballPosition, score) {
		this.users = userHelper.getUsers();
		this.actionManagers = {};
		this.ballPosition = ballPosition;
		this.score = (score) ? score : {};
		this.pitchRepresetation = new Pitch(this.ballPosition, userHelper);

		this.users.forEach(function(user, index) {
			!score && (this.score[user.team.name] = 0);
			this.actionManagers[user.id] = new TeamActionsManager(user, this.pitchRepresetation);			
		}, this);

		this.pitchRepresetation.setScore(this.score);
	};

	State.prototype.modifyState = function(data) {
		console.log("\n----------------------------- RESOLVING ACTIONS -----------------------------");

		Object.keys(data).forEach(function(userId) {
			var user = data[userId];
			Object.keys(user).forEach(function(playerName) {
				var playerData = user[playerName];
				this.actionManagers[userId].scheduleAction(playerName, playerData);
			}, this);
		}, this);

		//Actions will be executed secuentialy across all users.
		var allActionsExecuted = false;
		while (!allActionsExecuted) {
			Object.keys(this.actionManagers).forEach(function(userId) {
				allActionsExecuted = this.actionManagers[userId].executeNextAction();
			}, this);
		}

		console.log("-----------------------------------------------------------------------------");
	};

	State.prototype.generateMessage = function() {
		this.ballPosition = this.pitchRepresetation.getBallPosition();
		this.score = this.pitchRepresetation.getScore();

		var state = {
			"config": config,
			"ball": this.ballPosition,
			"score": this.score,
			"users": this.pitchRepresetation.buildUsers()
		};

		return {"game": state};
	};

	return State;
};
