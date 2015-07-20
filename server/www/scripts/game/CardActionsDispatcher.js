define(["game/UserAreaController", "game/CardController"], function(UserAreaController) {
	"use strict";

	CardActionsdispatcher = function() {
	};

	CardActionsdispatcher.prototype.cardActionSelected = function(card, callback) {
		//TODO this will have to come from the description to know which palyers can be selected, all of players' for the moment
		UserAreaController.allowPlayerSelection(players, onPlayerSelectedForAction.bind(this, card, callback));

	};

	CardActionsdispatcher.prototype.cardActionDeselected = function(card) {
		UserAreaController.disableActionForCard(cardName);
	};

	CardActionsdispatcher.prototype.playerCardActionSelected = function(card) {

	};

	CardActionsdispatcher.prototype.playerCardActionDeselected = function(card) {

	};

	function onPlayerSelectedForAction = function(card, callback) {
		UserAreaController.enableActionForCard(card, card.cardActionData);
		callback();
	};

});