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
		}
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


MockTurnResolver = (function(){
	"use strict";

	//TODO obviously, refactor this once it goes to server
	var MockTurnResolver = function(previousState, finalState, turnResolutionCallback, StateHelper) {
		this.previousState = previousState;
		this.finalState = finalState;
		this.callback = turnResolutionCallback;
		this.StateHelper = StateHelper;

		this.resolutionStrategies = {
			"NO_CONFLICTS": generateRandomOutputTurn.bind(this),
			"SIMPLE_CONFLICTS": resolveWithConflicts.bind(this)
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

		console.log(this.outputState);
		this.callback(this.outputState);

	};

	function generateRandomOutputTurn(canGenerateConflicts) {
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

		//Rival players
		Object.keys(rivalPlayers).forEach(function(playerName) {
			var playersResolved = {};
			var posibilities = generatePosibilities.call(this, rivalPlayers[playerName], dimensions, this.outputState.state.players, canGenerateConflicts, playersResolved);
			
			// console.log("----- Posibilities for: " + playerName + ":");
			// for (var i = 0; i < posibilities.length; i++) {
			// 	console.log("----- x: " + posibilities[i].x + ", y: " + posibilities[i].y);
			// }
			// console.log("----- -----");

			var i = Math.floor(Math.random() * (posibilities.length));
			playersResolved[playerName] = {};
			this.outputState.state.players[playerName] = {};
			this.outputState.state.players[playerName].x = posibilities[i].x;
			this.outputState.state.players[playerName].y = posibilities[i].y;
			playersResolved[playerName].x = posibilities[i].x;
			playersResolved[playerName].y = posibilities[i].y;
			this.outputState.state.players[playerName].action = "";


			if (stateHelper.playerHasBall(playerName)) {
				this.outputState.state.ball.x = this.outputState.state.players[playerName].x;
				this.outputState.state.ball.y = this.outputState.state.players[playerName].y;
			} 
		}.bind(this));

		//Pass Action
		if (playerPass) {
			this.outputState.state.ball.x = this.outputState.state.players[playerPass].x;
			this.outputState.state.ball.y = this.outputState.state.players[playerPass].y;
		}
	};

	function resolveWithConflicts() {
		generateRandomOutputTurn.call(this, true);
		console.log("----- SIMPLE CONFLICTS TURN RESOLUTION");

		var generatedState = new this.StateHelper(this.outputState);
		var inputState =  new this.StateHelper(this.previousState);
		var userPlayers = generatedState.getUserPlayerPositions();
		var rivalPlayers = generatedState.getRivalPlayerPositions();
		var players = this.previousState.state.players;
		var dimensions = inputState.getDimensions();
		var playerWithBall = null;
		var movesAfterConflicts = {};
		var playerConflictsResolved = [];

		for (var player in players) {
			for (var playerAgainst in players) {
				if (player !== playerAgainst && isThereConflict(players[player], this.outputState.state.players[playerAgainst]) && !movesAfterConflicts[player] && !movesAfterConflicts[playerAgainst]) {
					console.log ("------ CONFLICT between: " + player + " and " + playerAgainst + " won by: ");
					if (inputState.playerHasBall(player) && this.finalState[player] && this.finalState[player].action === "Pass") {
						//pass from
						var result = generateResolution(inputState.getPlayerStats(player).PASS, inputState.getPlayerStats(playerAgainst).DEFENCE);
						if (!result) {
							var playerWithBall = playerAgainst;
							movesAfterConflicts[playerAgainst] = {};
							movesAfterConflicts[playerAgainst].x = this.previousState.state.players[playerAgainst].x;
							movesAfterConflicts[playerAgainst].y = this.previousState.state.players[playerAgainst].y;
							console.log("------- " + playerAgainst);
						} else {
							console.log("------- " + player);
						}

					} else if (generatedState.playerHasBall(player)) {
						//pass to or move
						var result = generateResolution(inputState.getPlayerStats(player).ATTACK, inputState.getPlayerStats(playerAgainst).DEFENCE);
						if (!result) {
							movesAfterConflicts[player] = {};
							var playerWithBall = playerAgainst;
							if (this.outputState.state.players[player].x === this.previousState.state.players[player].x && this.outputState.state.players[player].y === this.previousState.state.players[player].y) {
								movePlayerBack.call(this, this.outputState.state.side, movesAfterConflicts[player], this.previousState.state.players[player], dimensions);
							} else {
								movesAfterConflicts[player].x = this.previousState.state.players[player].x;
								movesAfterConflicts[player].y = this.previousState.state.players[player].y;
							}
							console.log("------- " + playerAgainst);
						} else {
							movesAfterConflicts[playerAgainst] = {};
							movesAfterConflicts[playerAgainst].x = this.previousState.state.players[playerAgainst].x;
							movesAfterConflicts[playerAgainst].y = this.previousState.state.players[playerAgainst].y;	
							console.log("------- " + player);
						}
					} else {
						//rest of the conflicts
						var result = generateResolution(inputState.getPlayerStats(player).STRENGTH, inputState.getPlayerStats(playerAgainst).STRENGTH);
						if (!result) {
							movesAfterConflicts[player] = {};
							if (this.outputState.state.players[player].x === this.previousState.state.players[player].x && this.outputState.state.players[player].y === this.previousState.state.players[player].y) {
								movePlayerBack.call(this, this.outputState.state.side, movesAfterConflicts[player], this.previousState.state.players[player], dimensions);
							} else {
								movesAfterConflicts[player].x = this.previousState.state.players[player].x;
								movesAfterConflicts[player].y = this.previousState.state.players[player].y;
							}
							console.log("------- " + playerAgainst);
						} else {
							movesAfterConflicts[playerAgainst] = {};
							movesAfterConflicts[playerAgainst].x = this.previousState.state.players[playerAgainst].x;
							movesAfterConflicts[playerAgainst].y = this.previousState.state.players[playerAgainst].y;
							console.log("------- " + player);
						}
					}
				}
				
			}
		}

		if (playerWithBall) {
			console.log("------ SWAPING SIDES!!!");
			this.outputState.state.ball.x = this.outputState.state.players[playerWithBall].x;
			this.outputState.state.ball.y = this.outputState.state.players[playerWithBall].y;
			this.outputState.state.side = (this.outputState.state.side === "attacking") ? "defending" : "attacking";
		}

		Object.keys(movesAfterConflicts).forEach(function(player) {
			this.outputState.state.players[player].x = movesAfterConflicts[player].x;
			this.outputState.state.players[player].y = movesAfterConflicts[player].y;
		}.bind(this));
	};

	function movePlayerBack(side, newPosition, oldPosition, dimensions) {
		newPosition.x = oldPosition.x;
		newPosition.y = oldPosition.y;
		if (side === "attacking") {
			newPosition.x += (oldPosition.x - 1 >= 0) ? -1 : 1;
		} else {
			newPosition.x += (oldPosition.x + 1 < dimensions.columns) ? 1 : -1;
		}
	}

	function generateResolution(stat1, stat2) {
		var result = false;
		if ((Math.floor(Math.random() * 10) + stat1) > (Math.floor(Math.random() * 10) + stat2))  {
			result = true;
		}

		return result;
	};

	function isThereConflict (player1, player2) {
		var result = false;
		if (player1.x === player2.x && player1.y === player2.y) {
			result = true;
		}
		return result;
	};

	function generatePosibilities(playerPosition, dimensions, players, canHaveConflicts, playersToAvoidCollisionsWith) {
		var allPosibilities = [];
		for (var i = -1; i <= 1; i++) {
			var x = playerPosition.x + i;
			var y = playerPosition.y;
			if (x < dimensions.columns && x >= 0 && y >= 0 && y < dimensions.rows && !isIn(x, y, allPosibilities)) {
				if (!canHaveConflicts) {
					if (!isPlayerPosition(x, y, players)) {
						allPosibilities.push({"x": x, "y": y});
					}
					continue;	
				} else {
					if (!isPlayerPosition(x, y, playersToAvoidCollisionsWith)) {
						allPosibilities.push({"x": x, "y": y});
					}
				}
			}
		}
		for (var i = -1; i <= 1; i++) {
			var x = playerPosition.x;
			var y = playerPosition.y + i;
			if (x < dimensions.columns && x >= 0 && y >= 0 && y < dimensions.rows && !isIn(x, y, allPosibilities)) {
				if (!canHaveConflicts) {
					if (!isPlayerPosition(x, y, players)) {
						allPosibilities.push({"x": x, "y": y});
					}
					continue;	
				} else {
					if (!isPlayerPosition(x, y, playersToAvoidCollisionsWith)) {
						allPosibilities.push({"x": x, "y": y});
					}
				}	
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
		this.turnTimeout = null;
		
		this.userAreaController.on("turn-end", sendTurnEnd.bind(this))
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
		var turnResolver = new MockTurnResolver(this.state, outputState, this.nextTurn.bind(this), this.StateHelperContructor); 
		turnResolver.resolveTurn("SIMPLE_CONFLICTS");
	};

	GameManager.prototype.nextTurn = function(state) {
		this.state = state;
		this.userAreaController.loadState(new this.StateHelperContructor(this.state), true);
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

		var timeout = 60000;
		this.turnTimeout =  window.setInterval(function() {
			timeout -= 100;
			this.userAreaController.adjustTimeout(timeout);
		}.bind(this), 100)

	}

	return GameManager;

})();

