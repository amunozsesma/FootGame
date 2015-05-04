/**************************************************
** USER CLASS
**************************************************/

module.exports = function() {
	"use strict";

	var actions = {
		"Move" : move,
		"Pass" : pass,
		"Shoot": shoot,
		"Press": press,
		"Card" : card
	};

	var actionOrder = ["Card", "Pass", "Shoot", "Move", "Press"];

	var User = function(name, team, teamName, id) {
	    //These will go in the message
	    this.id = id;
		this.name = name;
	    this.team = team;
	    this.teamName = teamName;

	    //These wont
	    this.players = createPlayers(team);
		this.nextActionIndex = 0;
		this.actionScheduler = {
			"Move" : [],
			"Pass" : [],
			"Shoot": [],
			"Press": [],
			"Card" : []
		};
	};

	//TODO rename to build and this class to UserBuilder. 
	//  Will convert modified state (stored in 'players') to the message
	User.prototype.generateMessage = function() {
		var playersArray = [];
		if (this.players) {
			this.team.players.forEach(function(player) {
				player.position.x = this.players[player.name].position.x;
				player.position.y = this.players[player.name].position.y;
			}, this);
		}

		var message = {
			"id": this.id,
			"name": this.name,
			"team": this.team,
			"teamName": this.teamName 
		};

		return message;
	};

	//Plans actions
	User.prototype.scheduleAction = function(playerName, data) {
		var action = data["action"];
		if (action !== "") {
			this.actionScheduler[action].push(actions[action].bind(this, playerName, data.x, data.y));
		}
	};

	//Resolves actions: returns true if all actions have been executed.
	User.prototype.executeNextAction = function() {
		var nextAction = actionOrder[this.nextActionIndex];
		this.actionScheduler[nextAction].forEach(function(action) {
			action();
		});

		this.nextActionIndex = (this.nextActionIndex < actionOrder.length - 1) ? ++this.nextActionIndex : 0; 
		return (this.nextActionIndex === 0);
	};

	//Utility
	function createPlayers(team) {
		var players = {};
		team.players.forEach(function(player) {
			var name = player.name;
			players[name] = {};
			players[name].position = {"x": player.position.x, "y": player.position.y};
			players[name].stats = player.stats;
		});

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

	return User;
};


