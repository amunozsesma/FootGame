require(["userArea/PitchService", "userArea/ActionsService", "userArea/InfoService", "userArea/StateHandler"], function(PitchService, ActionsService, InfoService, StateHandler) {

	var stateHandler = new StateHandler();
	
	var pitchService = new PitchService(document.getElementById("pitch-container"), stateHandler);
	var infoService = new InfoService(document.getElementById("info-container"), stateHandler);
	var actionshService = new ActionsService(document.getElementById("actions-container"), stateHandler);

	var gameManager = new GameManager(stateHandler);

	stateHandler.loadStaticContext();
	gameManager.start();

});

//TODO extract to separate file

GameManager = (function() {
	"use strict";

	var GameManager = function(stateHandler) {
		this.stateHandler = stateHandler;
	};

	GameManager.prototype.start = function() {

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