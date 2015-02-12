require(["userArea/PitchComponent", "userArea/ActionsComponent", "userArea/InfoComponent", "userArea/UserAreaController", "userArea/StateHelper"], function(PitchComponent, ActionsComponent, InfoComponent, UserAreaController, StateHelper) {

	var userAreaController = new UserAreaController();
	
	var pitchService = new PitchComponent(document.getElementById("pitch-container"), userAreaController);
	var infoService = new InfoComponent(document.getElementById("info-container"), userAreaController);
	var actionshService = new ActionsComponent(document.getElementById("actions-container"), userAreaController);

	//TODO GM will need to require the StateHelper
	var gameManager = new GameManager(userAreaController, StateHelper);

	userAreaController.loadStaticContext();
	gameManager.start();

	//TODO remove
	window.gm = gameManager;
});

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
					"stats": {"ATTACK": 2, "DEFENCE": 3, "SPEED": 1, "STAMINNA": 5},
					"img":"images/twerking1.jpg"
				},
				"TwerkinPlayer2": {
					"stats": {"ATTACK": 4, "DEFENCE": 1, "SPEED": 1, "STAMINNA": 2}, 
					"img":"images/twerking2.jpg"
				},
				"TwerkinPlayer3": {
					"stats": {"ATTACK": 7, "DEFENCE": 1, "SPEED": 1, "STAMINNA": 7}, 
					"img":"images/twerking3.jpg"
				}
			},
			"Culo Gordo F.C.": {
				"CuloGordoPlayer1": {
					"stats": {"ATTACK": 3, "DEFENCE": 3, "SPEED": 1, "STAMINNA": 8},
					"img":"images/culogordo1.jpg"
				},
				"CuloGordoPlayer2": {
					"stats": {"ATTACK": 2, "DEFENCE": 8, "SPEED": 1, "STAMINNA": 4},
					"img":"images/culogordo2.jpg"
				},
				"CuloGordoPlayer3": {
					"stats": {"ATTACK": 7, "DEFENCE": 7, "SPEED": 2, "STAMINNA": 9},
					"img":"images/culogordo3.jpg"
				}
			}
		},
		"actions": {
			"attacking": ["Move", "Pass", "Shoot", "Card"],
			"defending": ["Move", "Press", "Card"]
		}
	},
	"state": {
		"players": {
			"TwerkinPlayer1": {"x":0, "y":0, "action":""},
			"TwerkinPlayer2": {"x":0, "y":2, "action":""},
			"TwerkinPlayer3": {"x":0, "y":4, "action":""},
			"CuloGordoPlayer1": {"x":9, "y":0, "action":""},
			"CuloGordoPlayer2": {"x":9, "y":2, "action":""},
			"CuloGordoPlayer3": {"x":9, "y":4, "action":""}
		},
		"side":"attacking",
		"ball": {"x":0,"y":2},
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


MockTurnResolver = (function(){
	"use strict";

	var MockTurnResolver = function(previousState, finalState, turnResolutionCallback, StateHelper) {
		this.previousState = previousState;
		this.finalState = finalState;
		this.callback = turnResolutionCallback;
		this.StateHelper = StateHelper;

		this.resolutionStrategies = {
			"NO_CONFLICTS": resolveWithNoConflicts.bind(this)
		};


		this.outputState = {};
	};

	

	MockTurnResolver.prototype.resolveTurn = function(strategy) {
		this.outputState.config = this.previousState.config;

		if (this.resolutionStrategies[strategy]) {
			this.resolutionStrategies[strategy]();
		} else {
			this.resolutionStrategies["NO_CONFLICTS"]();
		}

		this.callback(this.outputState);
	};

	function resolveWithNoConflicts() {
		console.log("---- NO CONFLICTS TURN RESOLUTION");
		var stateHelper = new this.StateHelper(this.previousState);
		var userPlayers = stateHelper.getUserPlayerPositions();
		var rivalPlayers = stateHelper.getRivalPlayerPositions();
		var ball = stateHelper.getBallPosition();
		var dimensions = stateHelper.getDimensions();
		var playerPass = null;

		this.outputState.state = {};
		this.outputState.state.ball = {};
		this.outputState.state.players = {};
		this.outputState.state.side = this.previousState.state.side;
		this.outputState.state.scores = this.previousState.state.scores;

		//User players
		Object.keys(this.finalState).forEach(function(playerName) {
			if (stateHelper.playerHasBall(playerName)) {
				this.outputState.state.ball.x = this.finalState[playerName].x;
				this.outputState.state.ball.y = this.finalState[playerName].y;
			}

			this.outputState.state.players[playerName] = {};
			if (this.finalState[playerName].action === "Pass") {
				this.outputState.state.players[playerName].x = userPlayers[playerName].x;
				this.outputState.state.players[playerName].y = userPlayers[playerName].y;
				playerPass = stateHelper.getPlayerIn(this.finalState[playerName].x, this.finalState[playerName].y);
			} else {
				this.outputState.state.players[playerName].x = this.finalState[playerName].x;
				this.outputState.state.players[playerName].y = this.finalState[playerName].y;
			}
			
			this.outputState.state.players[playerName].action = "";
		}.bind(this));

		//Pass Action
		if (playerPass) {
			this.outputState.state.ball.x = this.outputState.state.players[playerPass].x;
			this.outputState.state.ball.y = this.outputState.state.players[playerPass].y;
		}
		
		//Rival players
		Object.keys(rivalPlayers).forEach(function(playerName) {
			var posibilities = generatePosibilities.call(this, rivalPlayers[playerName], dimensions, this.outputState.state.players);
			
			// console.log("----- Posibilities for: " + playerName + ":");
			// for (var i = 0; i < posibilities.length; i++) {
				// console.log("----- x: " + posibilities[i].x + ", y: " + posibilities[i].y);
			// }
			// console.log("----- -----");

			var i = Math.floor(Math.random() * (posibilities.length - 1));
			this.outputState.state.players[playerName] = {};
			this.outputState.state.players[playerName].x = posibilities[i].x;
			this.outputState.state.players[playerName].y = posibilities[i].y;
			this.outputState.state.players[playerName].action = "";
		}.bind(this));

	};

	function generatePosibilities(playerPosition, dimensions, players) {
		var allPosibilities = [];
		for (var i = -1; i <= 1; i++) {
			var x = playerPosition.x + i;
			var y = playerPosition.y;
			if (x < dimensions.columns && x >= 0 && y >= 0 && y < dimensions.rows && !isPlayerPosition(x, y, players) && !isIn(x, y, allPosibilities)) {
				allPosibilities.push({"x": x, "y": y});	
			}
		}
		for (var i = -1; i <= 1; i++) {
			var x = playerPosition.x;
			var y = playerPosition.y + i;
			if (x < dimensions.columns && x >= 0 && y >= 0 && y < dimensions.rows && !isPlayerPosition(x, y, players) && !isIn(x, y, allPosibilities)) {
				allPosibilities.push({"x": x, "y": y});	
			}
		}

		return allPosibilities;
	};

	function isPlayerPosition(x, y, players) {
		var result = false;
		for (var playerName in players) {
			if (players[playerName].x === x && players[playerName].y === y) {
				result = true;
				break;
			}
		}
		return result;
	};

	function isIn(x, y, array) {
		var result = false;
		for (var i = 0; i < array.length; i++) {
			if (array[i].x === x && array[i].y === y) {
				result = true;
				break;
			}
		}
		return result;
	};


	return MockTurnResolver;

})();

//TODO extract to separate file
GameManager = (function() {
	"use strict";

	var GameManager = function(userAreaController, StateHelperContructor) {
		this.userAreaController = userAreaController;
		this.state = {};
		this.userTeams = {};
		
		//TODO get rid once we require
		this.StateHelperContructor = StateHelperContructor;
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
			
		this.userAreaController.loadState(new this.StateHelperContructor(this.state), true);
	};

	//This will come from the server
	GameManager.prototype.endTurn = function() {
		var outputState = this.userAreaController.getTurnEndResult();


		//TODO send output to server, wait for callbacks to start nexturn
		var turnResolver = new MockTurnResolver(this.state, outputState, this.nextTurn.bind(this), this.StateHelperContructor); 
		turnResolver.resolveTurn();
	};

	GameManager.prototype.nextTurn = function(state) {
		this.state = state;
		this.userAreaController.loadState(new this.StateHelperContructor(this.state), true);
	};	

	return GameManager;

})();

