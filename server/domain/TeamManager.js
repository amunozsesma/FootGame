/**************************************************
** USER CLASS
**************************************************/

module.exports = function() {
	"use strict";

	var pitchUtils = require("./PitchUtils");
	var actions = {"Move" : move, "Pass" : pass, "Shoot": shoot, "Press": press, "Card" : card};
	var actionOrder = ["Card", "Pass", "Shoot", "Move", "Press"];

	var TeamManager = function(userBuilder, pitch) {
	    this.userBuilder = userBuilder;

	    this.players = createPlayers.call(this);
		this.nextActionIndex = 0;
		this.actionScheduler = {"Move" : [], "Pass" : [], "Shoot": [], "Press": [], "Card" : []};

		this.pitch = pitch;
	};

	//Modifies builder and builds it
	TeamManager.prototype.generateMessage = function() {
		if (this.players) {
			Object.keys(this.players).forEach(function(playerName) {
				this.userBuilder.setPosition(playerName, this.players[playerName].position.x, this.players[playerName].position.y);
			}, this);
		}
		
		var teamName = this.userBuilder.team.name;
		this.userBuilder.side = this.pitch.getSide(teamName);
		// this.userBuilder.side = (this.playerWithBall !== null) ? "attacking" : "defending";

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

	//Actions
	function move(playerName, posX, posY) {
		var posibilities = pitchUtils.getAdjacentPositions(this.players[playerName].position.x, this.players[playerName].position.y, 1);
		if (posibilities.indexOf(JSON.stringify({"x": posX, "y":posY})) !== -1) {
			this.players[playerName].position.x = posX;
			this.players[playerName].position.y = posY;
			
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

	};

	function press(playerName, posX, posY) {
		var from = this.players[playerName].position;
		var to = this.pitch.getPlayerPosition(posX, posY);
		var nextPosition = pitchUtils.nextPosition(from, to, 1);

		this.players[playerName].position.x = nextPosition.x;
		this.players[playerName].position.y = nextPosition.y;
		this.pitch.movePlayer(playerName, posX, posY);
	};

	function card(playerName, posX, posY) {

	};

	return TeamManager;
};


