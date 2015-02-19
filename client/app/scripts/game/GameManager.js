mockInitialMessage = {
	"config": {
		"players":3,
		"rows":5,
		"columns": 10,
		"user":"alvarito",
		"userTeam": "A.D. Twerkin",
		"rivalTeam": "Culo Gordo F.C.",
		"teams": {
			"A.D. Twerkin": {
				"TwerkinPlayer1": {
					"stats": {"ATTACK": 2, "DEFENCE": 3, "PASS": 3, "STRENGTH": 5},
					"img":"images/twerking1.jpg"
				},
				"TwerkinPlayer2": {
					"stats": {"ATTACK": 4, "DEFENCE": 1, "PASS": 5, "STRENGTH": 2}, 
					"img":"images/twerking2.jpg"
				},
				"TwerkinPlayer3": {
					"stats": {"ATTACK": 7, "DEFENCE": 1, "PASS": 9, "STRENGTH": 7}, 
					"img":"images/twerking3.jpg"
				}
			},
			"Culo Gordo F.C.": {
				"CuloGordoPlayer1": {
					"stats": {"ATTACK": 3, "DEFENCE": 3, "PASS": 2, "STRENGTH": 8},
					"img":"images/culogordo1.jpg"
				},
				"CuloGordoPlayer2": {
					"stats": {"ATTACK": 2, "DEFENCE": 8, "PASS": 3, "STRENGTH": 4},
					"img":"images/culogordo2.jpg"
				},
				"CuloGordoPlayer3": {
					"stats": {"ATTACK": 7, "DEFENCE": 7, "PASS": 5, "STRENGTH": 9},
					"img":"images/culogordo3.jpg"
				}
			}
		},
		"actions": {
			"attacking": ["Move", "Pass", "Shoot", "Card"],
			"defending": ["Move", "Press", "Card"]
		},
		"overallTimeout":30000
	},
	"state": {
		"players": {
			"TwerkinPlayer1": {"x":3, "y":0, "action":""},
			"TwerkinPlayer2": {"x":3, "y":2, "action":""},
			"TwerkinPlayer3": {"x":3, "y":4, "action":""},
			"CuloGordoPlayer1": {"x":4, "y":0, "action":""},
			"CuloGordoPlayer2": {"x":4, "y":2, "action":""},
			"CuloGordoPlayer3": {"x":4, "y":4, "action":""}
		},
		"side":"attacking",
		"ball": {"x":3,"y":2},
		"scores": {
			"A.D. Twerkin": 0,
			"Culo Gordo F.C.": 1
		}
	}
};

mockUsersMessage = {
	"alvarito": "A.D. Twerkin",
	"alexito": "Culo Gordo F.C."
}

define(["game/MockTurnResolver"], function(TurnResolver) {
	"use strict";

	var GameManager = function(userAreaController) {
		this.userAreaController = userAreaController;
		this.state = {};
		this.userTeams = {};
		this.turnTimeout = null;
		
		this.userAreaController.on("turn-end", sendTurnEnd.bind(this))
	};

	GameManager.prototype.start = function() {
		//poll for players and initialConfig, websockets probably
		//AJAXService.askForPlayers(onUserReady());
		//AJAXService.askForInitialConfig(onConfigReady());
		//AJAXService

		onConfigReady.call(this);
		onUserReady.call(this);

	};

	function onConfigReady(config) {
		this.state = mockInitialMessage;
		tryGameStart.call(this);

	};

	function onUserReady(userName) {
		this.userTeams = mockUsersMessage;
		tryGameStart.call(this);
	};

	function tryGameStart() {
		if (!this.state || Object.keys(this.userTeams).length !== 2) {
			return;
		}

		console.log("- GAME START!!");
		this.state.userTeams = this.userTeams;
			
		this.userAreaController.loadState(this.state, true);

		startTimeout.call(this);
	};

	function sendTurnEnd() {
		//TODO tell the server a user has selected tuen end
		//AJAXService.userEndedTurn(callback);

		this.endTurn();
	};

	//This will come from the server
	GameManager.prototype.endTurn = function() {
		var outputState = this.userAreaController.getTurnEndResult();


		//TODO send output to server, wait for callbacks to start nexturn
		var turnResolver = new TurnResolver(this.state, outputState, this.nextTurn.bind(this)); 
		turnResolver.resolveTurn("SIMPLE_CONFLICTS");
	};

	GameManager.prototype.nextTurn = function(state) {
		this.state = state;
		this.userAreaController.loadState(this.state, true);
		startTimeout.call(this);
	};	

	function startTimeout(stopTimeout) {
		//TODO read value from server
		
		if (this.turnTimeout) {
			window.clearInterval(this.turnTimeout);
		}

		if (stopTimeout) {
			return;
		}

		var timeout = this.state.config.overallTimeout;
		this.turnTimeout =  window.setInterval(function() {
			timeout -= 50;
			if (timeout === 0) {
				window.clearInterval(this.turnTimeout);		
				this.endTurn();
			}
			this.userAreaController.adjustTimeout(timeout);
		}.bind(this), 50)

	}

	return GameManager;

});