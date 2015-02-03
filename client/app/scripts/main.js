require(["userArea/PitchComponent", "userArea/ActionsComponent", "userArea/InfoComponent", "userArea/UserAreaController"], function(PitchComponent, ActionsComponent, InfoComponent, UserAreaController) {

	var userAreaController = new UserAreaController();
	
	var pitchService = new PitchComponent(document.getElementById("pitch-container"), userAreaController);
	var infoService = new InfoComponent(document.getElementById("info-container"), userAreaController);
	var actionshService = new ActionsComponent(document.getElementById("actions-container"), userAreaController);

	var gameManager = new GameManager(userAreaController);

	userAreaController.loadStaticContext();
	gameManager.start();

});

// initialMockConfig = {
// 	"config": {
// 		"players":3,
// 		"rows":3,
// 		"columns":6,
// 		"user":"alvarito",
// 		"team": "A.D. Twerkin",
// 		"rival": "Culo Gordo F.C."
// 	},
// 	"state": {
// 		"teams": {
// 			"A.D. Twerkin": {
// 				"TwerkinPlayer1": {"x":0, "y":1, "img":"images/twerking1.jpg"},
// 				"TwerkinPlayer2": {"x":1, "y":1, "img":"images/twerking2.jpg"},
// 				"TwerkinPlayer3": {"x":0, "y":2, "img":"images/twerking3.jpg"}
// 			},
// 			"Culo Gordo F.C.": {
// 				"CuloGordoPlayer1": {"x":5, "y":0, "img":"images/culogordo1.jpg"},
// 				"CuloGordoPlayer2": {"x":5, "y":1, "img":"images/culogordo2.jpg"},
// 				"CuloGordoPlayer3": {"x":5, "y":2, "img":"images/culogordo3.jpg"}
// 			}
// 		},
// 		"ball": {"x":3,"y":3}
// 	}
// }

initialMockConfig = {
	"config": {
		"players":3,
		"rows":3,
		"columns":6,
		"user":"alvarito",
		"team": "A.D. Twerkin",
		"rival": "Culo Gordo F.C."
	},
	"state": {
		"teams": {
			"A.D. Twerkin": {
				"TwerkinPlayer1": {"x":0, "y":1, "stats": {
					"ATTACK": 2,
					"DEFENCE": 3,
					"SPEED": 1,
					"STAMINNA": 5
				}, "actions": ["MOVE", "PASS", "SHOOT"],
					"img":"images/twerking1.jpg"},
				"TwerkinPlayer2": {"x":1, "y":1, "stats": {
					"ATTACK": 4,
					"DEFENCE": 1,
					"SPEED": 1,
					"STAMINNA": 2
				}, "actions": ["MOVE", "PASS", "SHOOT"],
					"img":"images/twerking2.jpg"},
				"TwerkinPlayer3": {"x":0, "y":2, "stats": {
					"ATTACK": 7,
					"DEFENCE": 1,
					"SPEED": 1,
					"STAMINNA": 7
				}, "actions": ["MOVE", "PASS", "SHOOT"],
					"img":"images/twerking3.jpg"}
			},
			"Culo Gordo F.C.": {
				"CuloGordoPlayer1": {"x":5, "y":0, "stats": {
					"ATTACK": 3,
					"DEFENCE": 3,
					"SPEED": 1,
					"STAMINNA": 8
				},
					"img":"images/culogordo1.jpg"},
				"CuloGordoPlayer2": {"x":5, "y":1, "stats": {
					"ATTACK": 2,
					"DEFENCE": 8,
					"SPEED": 1,
					"STAMINNA": 4
				},
					"img":"images/culogordo2.jpg"},
				"CuloGordoPlayer3": {"x":5, "y":2, "stats": {
					"ATTACK": 7,
					"DEFENCE": 7,
					"SPEED": 2,
					"STAMINNA": 9
				},
					"img":"images/culogordo3.jpg"}
			}
		},
		"ball": {"x":3,"y":3},
		"scores": {
			"A.D. Twerkin": 0,
			"Culo Gordo F.C.": 1
		}
	}
}

initialMockUsers = {
	"alvarito": "A.D. Twerkin",
	"alexito": "Culo Gordo F.C."
}

//TODO extract to separate file
GameManager = (function() {
	"use strict";

	var GameManager = function(userAreaController) {
		this.userAreaController = userAreaController;
		this.state = {};
		this.userTeams = {};
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
		this.state = initialMockConfig;
		tryGameStart.call(this);

	};

	function onUserReady(userName) {
		this.userTeams = initialMockUsers;
		tryGameStart.call(this);
	};

	function tryGameStart() {
		if (!this.state || Object.keys(this.userTeams).length !== 2) {
			return;
		}

		console.log("GAME START!!");
		this.state.userTeams = this.userTeams;
			
		this.userAreaController.loadState(this.state, true);
	};

	return GameManager;

})();


// maint() {

// }

// paintEverything() {
// 	UserManager.start();
// 	GameManager.start();
// 	CardsManager.start();
// }

// GameManager.start = function() {
// 	ConfigService.loadConfig(startGameIfEverythingUp());
// 	onUserREady(startGameIfEverythingUp());
// }

// startGameIfEverythingUp{
// 	if (user1 = true && user2 == true && props = true) {
// 		startGame()
// 	}
// }

// startGame() {
	
// }