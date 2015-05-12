/**************************************************
** USER CLASS
**************************************************/

module.exports = function() {
	"use strict";

	var pitchUtils = require("./PitchUtils");
	var actions = {"Move" : move, "Pass" : pass, "Shoot": shoot, "Press": press, "Card" : card};
	var actionOrder = ["Card", "Pass", "Shoot", "Move", "Press"];

	var TeamManager = function(userBuilder, ballPosition) {
	    this.userBuilder = userBuilder;

	    this.players = createPlayers.call(this);
		this.nextActionIndex = 0;
		this.actionScheduler = {"Move" : [], "Pass" : [], "Shoot": [], "Press": [], "Card" : []};

		this.ballPosition = ballPosition;
		this.playerWithBall = (this.ballPosition) ? getPlayerIn.call(this, this.ballPosition) : null;
	};

	//Modifies builder and builds it
	TeamManager.prototype.generateMessage = function() {
		if (this.players) {
			Object.keys(this.players).forEach(function(playerName) {
				this.userBuilder.setPosition(playerName, this.players[playerName].position.x, this.players[playerName].position.y);
			}, this);
		}
		this.userBuilder.side = (this.playerWithBall !== null) ? "attacking" : "defending";

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

	TeamManager.prototype.getBallPosition = function() {
		return (this.playerWithBall !== null) ? {"x": this.players[this.playerWithBall].position.x, "y": this.players[this.playerWithBall].position.y} : null;
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

	function getPlayerIn(position) {
		var player = null;
		for (var playerName in this.players) {
			if (this.players[playerName].position.x === position.x && this.players[playerName].position.y === position.y) {
				player = playerName;
				break;
			}
		}
		return player;
	};

	//Action functions
	function move(playerName, posX, posY) {
		var posibilities = pitchUtils.getAdjacentPositions(this.players[playerName].position.x, this.players[playerName].position.y, 1);
		if (posibilities.indexOf(JSON.stringify({"x": posX, "y":posY})) !== -1) {
			this.players[playerName].position.x = posX;
			this.players[playerName].position.y = posY;
			
			if (this.ballPosition.x === posX && this.ballPosition.y === posY) {
				this.playerWithBall = playerName;
			}
		} else {
			//TODO possible hack from client
			console.log("Position [" + posX + ", " + posY + "] is not valid for '" + playerName + "'.");
		}
	};

	function pass(playerName, posX, posY) {
		if (this.playerWithBall === playerName) {
			this.playerWithBall = getPlayerIn.call(this, {"x": posX, "y": posY});
		}
	};

	function shoot(playerName, posX, posY) {

	};

	function press(playerName, posX, posY) {
		//TODO use the Pitch class to determine the new position of the player press was initially pointing to
		var position = this.players[playerName].position;
		var nextPosition = pitchUtils.nextPosition(position, {"x": posX, "y": posY}, 1);
		this.players[playerName].position.x = nextPosition.x;
		this.players[playerName].position.y = nextPosition.y;
	};

	function card(playerName, posX, posY) {

	};

	return TeamManager;
};


