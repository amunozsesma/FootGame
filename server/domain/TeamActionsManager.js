/**************************************************
** USER CLASS
**************************************************/

module.exports = function() {
	"use strict";

	var pitchUtils = require("./PitchUtils");
	var actions = {"Move" : move, "Pass" : pass, "Shoot": shoot, "Press": press, "Card" : card};
	var actionOrder = ["Card", "Pass", "Shoot", "Move", "Press"];

	var TeamActionsManager = function(userBuilder, pitch) {
	    this.userBuilder = userBuilder;
		this.pitch = pitch;

		this.nextActionIndex = 0;
		this.actionScheduler = {"Move" : [], "Pass" : [], "Shoot": [], "Press": [], "Card" : []};

	};

	//Plans actions
	TeamActionsManager.prototype.scheduleAction = function(playerName, data) {
		var action = data["action"];
		if (action !== "") {
			this.actionScheduler[action].push(actions[action].bind(this, playerName, data.x, data.y));
		}
	};

	//Resolves actions: returns true if all actions have been executed.
	TeamActionsManager.prototype.executeNextAction = function() {
		var nextAction = actionOrder[this.nextActionIndex];
		this.actionScheduler[nextAction].forEach(function(action) {
			action();
		});

		this.nextActionIndex = (this.nextActionIndex < actionOrder.length - 1) ? ++this.nextActionIndex : 0; 
		return (this.nextActionIndex === 0);
	};

	//Actions
	function move(playerName, posX, posY) {
		var playerPosition = this.userBuilder.getPosition(playerName);
		var posibilities = pitchUtils.getAdjacentPositions(playerPosition.x, playerPosition.y, 1);
		if (posibilities.indexOf(JSON.stringify({"x": posX, "y":posY})) !== -1) {
			this.pitch.movePlayer(playerName, posX, posY);
		} else {
			//TODO possible hack from client
			console.log("Position [" + posX + ", " + posY + "] is not valid for '" + playerName + "'.");
		}
		
	};

	function pass(playerName, posX, posY) {
		if (this.pitch.hasPlayerTheBall(playerName)) {
			this.pitch.moveBall(posX, posY);
		}
	};

	function shoot(playerName, posX, posY) {
		if (this.pitch.hasPlayerTheBall(playerName)) {
			this.pitch.shoot(playerName, posX, posY);
		}
	};

	function press(playerName, posX, posY) {
		var from = this.userBuilder.getPosition(playerName);
		var to = this.pitch.getPlayerPosition(this.pitch.getPlayerIn(posX, posY));
		var nextPosition = pitchUtils.nextPosition(from, to, 1);

		this.pitch.movePlayer(playerName, nextPosition.x, nextPosition.y);
	};

	function card(playerName, posX, posY) {

	};

	return TeamActionsManager;
};


