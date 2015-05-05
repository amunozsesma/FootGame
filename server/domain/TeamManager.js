/**************************************************
** USER CLASS
**************************************************/

module.exports = function() {
	"use strict";

	var actions = {"Move" : move, "Pass" : pass, "Shoot": shoot, "Press": press, "Card" : card};
	var actionOrder = ["Card", "Pass", "Shoot", "Move", "Press"];

	var TeamManager = function(userBuilder) {
	    this.userBuilder = userBuilder;

	    this.players = createPlayers.call(this);
		this.nextActionIndex = 0;
		this.actionScheduler = {"Move" : [], "Pass" : [], "Shoot": [], "Press": [], "Card" : []};

		this.playerWithBall = null;
	};

	//Modifies builder and builds it
	TeamManager.prototype.generateMessage = function() {
		if (this.players) {
			Object.keys(this.players).forEach(function(playerName) {
				this.userBuilder.setPosition(playerName, this.players[playerName].position.x, this.players[playerName].position.y);
			}, this);
		}

		return this.userBuilder.build();
	};

	//Plans actions
	TeamManager.prototype.scheduleAction = function(playerName, data) {
		var action = data["action"];
		if (action !== "") {
			this.actionScheduler[action].push(actions[action].bind(this, playerName, data.x, data.y));
		}
	};

	//Resolves actions: returns true if all actions have been executed.
	TeamManager.prototype.executeNextAction = function() {
		var nextAction = actionOrder[this.nextActionIndex];
		this.actionScheduler[nextAction].forEach(function(action) {
			action();
		});

		this.nextActionIndex = (this.nextActionIndex < actionOrder.length - 1) ? ++this.nextActionIndex : 0; 
		return (this.nextActionIndex === 0);
	};

	function createPlayers() {
		var playerNames = this.userBuilder.getPlayerNames();
		var players = {};
		playerNames.forEach(function(playerName) {
			var position = this.userBuilder.getPosition(playerName);
			players[playerName] = {};
			players[playerName].position = {"x": position.x, "y": position.y};
		}, this);

		return players;
	};

	//Action functions
	function move(playerName, posX, posY) {
		this.players[playerName].position.x = posX;
		this.players[playerName].position.y = posY;
	};

	function pass(playerName, posX, posY) {

	};

	function shoot(playerName, posX, posY) {

	};

	function press(playerName, posX, posY) {

	};

	function card(playerName, posX, posY) {

	};

	return TeamManager;
};


