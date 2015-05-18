//Models a turn state, builds the state messages 
module.exports = function() {
	"use strict";
	
	var TeamManager = require("./TeamManager")();
	var Pitch = require("./Pitch")();

	var config = require("./Config");

	var State = function(users, ballPosition, score) {
		this.users = users;
		this.teams = {};
		this.ballPosition = (ballPosition) ? ballPosition : {"x": 5, "y": 2};
		this.score = (score) ? score : {};
		this.pitchRepresetation = new Pitch(this.ballPosition);

		this.users.forEach(function(user, index) {
			!score && (this.score[user.team.name] = 0);
			this.pitchRepresetation.setUser(user, index);
			this.teams[user.id] = new TeamManager(user, this.pitchRepresetation);			
		}, this);

		this.pitchRepresetation.setScore(this.score);
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
