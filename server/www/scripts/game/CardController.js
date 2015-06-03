define(["libs/Emitter"], function(Emitter) {
	"use strict";

	var CardController = function() {
		//TODO remove 
		this.allCards = [{name: "Sprint", affectedPlayers: 1}, {name: "Drible", affectedPlayers: 1}, {name: "Fall Back", affectedPlayers: 2}, {name: "Counter Attack", affectedPlayers: 2}];
		this.turnCards = [];
		window.nt = this.newTurn.bind(this);
		////////////////////////////////////////////////////
	};

	Emitter.mixInto(CardController);

	CardController.prototype.newTurn = function() {
		this.trigger("new-turn", getCards.call(this));
	};

	CardController.prototype.getNumberCards = function() {
		//TODO ask server
		return this.allCards.length;
	};

	function getCards() {
		//TODO get cards from server
		var card = this.allCards.pop();
		this.turnCards.push(card);
		////////////////////////////////////////////////////

		return this.turnCards;
	};

	return new CardController();
});