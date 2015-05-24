module.exports = function() {
	"use strict";

	var config = require("./Config");
	var ConflictHandler = require("./ConflictHandler")();

	var Pitch = function(ballPosition, userHelper) {
		this.playerInitialPositions = {};
		this.playerMovedPositions = {};
		this.ballInitialPosition = ballPosition || Pitch.BALL_INITIAL_POSITION;
		this.ballMovedPosition = null;
		this.playerHasBall = null;
		this.score = {};

		this.userHelper = userHelper;
		this.conflictHandler = new ConflictHandler(this.userHelper);

		setStartingPositions.call(this);
	};

	Pitch.STARTING_POSITION_LEFT = 0;
	Pitch.STARTING_POSITION_RIGHT = 0;
	Pitch.BALL_INITIAL_POSITION = {"x": 5, "y": 2};

	function setStartingPositions() {
		var teams = this.userHelper.getTeams();
		teams.forEach(function(teamName, teamIndex) {
			var players = this.userHelper.getPlayers(teamName);
			players.forEach(function (playerName, playerIndex) {
				var position = (this.userHelper.isPositionSet(playerName)) ? this.userHelper.getPosition(playerName) : generateInitialPosition(teamIndex, playerIndex);
				this.playerInitialPositions[playerName] = position;
				if (samePosition(this.ballInitialPosition, position.x, position.y)) {
					this.playerHasBall = playerName;
				}
			}, this)
		}, this);
	};

	Pitch.prototype.buildUsers = function() {

		this.playerMovedPositions = this.conflictHandler.getResolvedPositions(this.playerInitialPositions, this.playerMovedPositions);

		var allPlayers = this.userHelper.getAllPlayers();
		allPlayers.forEach(function(playerName) {
			var position = (this.playerMovedPositions[playerName]) ? this.playerMovedPositions[playerName] : this.playerInitialPositions[playerName];
			var teamName = this.userHelper.getTeam(playerName);
			this.ballMovedPosition && samePosition(this.ballMovedPosition, position.x, position.y) && (this.playerHasBall = playerName);
			this.userHelper.setPosition(playerName, position.x, position.y);
			this.userHelper.setSide(teamName, this.getSide(teamName));
		}, this);

		return this.userHelper.buildAllUsers();
	};

	Pitch.prototype.setScore = function(score) {
		this.score = score;
	};

	Pitch.prototype.getScore = function() {
		return this.score;
	};
	
	Pitch.prototype.getSide = function(teamName) {
		var players = this.userHelper.getPlayers(teamName);
		return (players.indexOf(this.playerHasBall) !== -1) ? "attacking" : "defending";
	};

	//Ball moves always before players move -> check in old position
	Pitch.prototype.moveBall = function(posX, posY) {
		this.ballMovedPosition = {"x": posX, "y": posY};
		this.playerHasBall = this.getPlayerIn(posX, posY);
	};

	Pitch.prototype.movePlayer = function(playerName, posX, posY) {
		this.playerMovedPositions[playerName] = {"x": posX, "y": posY};
		if (this.hasPlayerTheBall(playerName)) {
			this.ballMovedPosition = {"x": posX, "y": posY};
		}
		if (!this.playerHasBall && samePosition(this.ballInitialPosition, posX, posY)) {
			this.playerHasBall = playerName;
		} 
	};

	Pitch.prototype.shoot = function(playerName, posX, posY) {
		this.userHelper.resetAllPositions();
		this.playerHasBall = null;
		this.ballInitialPosition = Pitch.BALL_INITIAL_POSITION;
		this.ballMovedPosition = null;
		setStartingPositions.call(this);
		this.score[this.userHelper.getTeam(playerName)] ++;
	};

	Pitch.prototype.hasPlayerTheBall = function(playerName) {
		return (this.playerHasBall === playerName);
	};

	Pitch.prototype.getPlayerPosition = function(playerName) {
		var playerPositions = (this.playerMovedPositions[playerName]) ? this.playerMovedPositions : this.playerInitialPositions;
		return playerPositions[playerName];

	};

	Pitch.prototype.getBallPosition = function() {
		return (!!this.ballMovedPosition) ? this.ballMovedPosition : this.ballInitialPosition;
	};

	Pitch.prototype.getPlayerIn = function(posX, posY) {
		for (var playerName in this.playerInitialPositions) {
			if (samePosition(this.playerInitialPositions[playerName], posX, posY)) {
				return playerName; 
			}
		}
	};

	function samePosition(position, posX, posY) {
		return (position.x === posX && position.y === posY);
	};

	function generateInitialPosition(side, index) {
		var x = (side === Pitch.STARTING_POSITION_RIGHT) ? Math.floor(3*config.numColumns / 4) : Math.floor(config.numColumns / 4);
		var y = Math.ceil(index * config.numRows / config.numPlayers );
	
		return {"x": x, "y": y};
	};

	return Pitch;
};

