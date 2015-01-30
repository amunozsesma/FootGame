require(["userArea/PitchService", "userArea/ActionsService", "userArea/InfoService", "userArea/StateHandler"], function(PitchService, ActionsService, InfoService, StateHandler) {

	var stateHandler = new StateHandler();
	
	var pitchService = new PitchService(document.getElementById("pitch-container"), stateHandler);
	var infoService = new InfoService(document.getElementById("info-container"), stateHandler);
	var actionshService = new ActionsService(document.getElementById("actions-container"), stateHandler);

	var gameManager = new GameManager(stateHandler);

	stateHandler.loadStaticContext();
	gameManager.start();

});

initialMockConfig = {
	"config": {
		"players":3,
		"rows":3,
		"columns":9
	},
	"state": {
		"TwerkinPlayer1": {"x":0, "y":1},
		"TwerkinPlayer2": {"x":1, "y":1},
		"TwerkinPlayer3": {"x":0, "y":2},
		"CuloGordoPlayer1": {"x":5, "y":0},
		"CuloGordoPlayer2": {"x":5, "y":1},
		"CuloGordoPlayer3": {"x":5, "y":2},
		"ball": {"x":3,"y":3}
	}
}

initialMockUsers = {
	"alvarito": "A.D. Twerkin",
	"alexito": "Culo Gordo F.C."
}

//TODO extract to separate file
GameManager = (function() {
	"use strict";

	var GameManager = function(stateHandler) {
		this.stateHandler = stateHandler;
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
			
		this.stateHandler.loadState(this.state, true);
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