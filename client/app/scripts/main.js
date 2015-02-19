require([
	"game/components/PitchComponent", 
	"game/components/ActionsComponent", 
	"game/components/InfoComponent", 
	"game/UserAreaController", 
	"game/GameManager"], 
	function(PitchComponent, ActionsComponent, InfoComponent, UserAreaController, GameManager) {

	var userAreaController = new UserAreaController();
	
	var pitchService = new PitchComponent(document.getElementById("pitch-container"), userAreaController);
	var infoService = new InfoComponent(document.getElementById("info-container"), userAreaController);
	var actionshService = new ActionsComponent(document.getElementById("actions-container"), userAreaController);

	var gameManager = new GameManager(userAreaController);

	userAreaController.loadStaticContext();
	gameManager.start();

	//TODO remove
	window.gm = gameManager;
});
