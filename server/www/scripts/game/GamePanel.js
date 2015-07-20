define([
	"react",
	"jsx!game/components/PitchComponent", 
	"jsx!game/components/ActionsComponent", 
	"jsx!game/components/CardInfoComponent",
	"jsx!game/components/InfoComponent", 
	"jsx!game/components/CardsComponent", 
	"game/GameManager"], 
function(React, PitchComponent, ActionsComponent, CardInfoComponent, InfoComponent, CardsComponent, GameManager) {
	"use strict";

	function GamePanel() {
		this.gameManager = new GameManager();

		this.keyPressHandler = function(event) {
			if (event.keyCode === 13) {
				this.gameManager.onTurnEndedByUser();			
			}
		}.bind(this);
	};

	GamePanel.prototype.getElement = function() {
		var infoContainer     = React.createElement("div", {id: "info-container"});
		var pitchContainer    = React.createElement("div", {id: "pitch-container"});
		var actionsContainer  = React.createElement("div", {id: "actions-container"});
		var cardInfoContainer = React.createElement("div", {id: "cardinfo-container"});
		var userArea          = React.createElement("div", {id: "user-area"}, [infoContainer, pitchContainer, cardInfoContainer, actionsContainer]);
		var cardArea          = React.createElement("div", {id: "card-area"});

		return [userArea, cardArea]; 
	};

	GamePanel.prototype.onShow = function() {
		React.render(PitchComponent, document.getElementById("pitch-container"));
		React.render(InfoComponent, document.getElementById("info-container"));
		React.render(ActionsComponent, document.getElementById("actions-container"));
		React.render(CardInfoComponent, document.getElementById("cardinfo-container"));
		React.render(CardsComponent, document.getElementById("card-area"));

		this.gameManager.start();
		document.body.addEventListener("keypress", this.keyPressHandler);
	};

	GamePanel.prototype.onHide = function() {
		document.body.removeEventListener("keypress", this.keyPressHandler);
		this.gameManager.stop();
	};	
	
	GamePanel.prototype.onClose = function() {
	};

	return GamePanel;
});