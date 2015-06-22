define(["libs/Emitter", "utils/Utils", "game/Card", "game/UserAreaController"], function(Emitter, Utils, Card, UserAreaController) {
	"use strict";

	var CardController = function() {
		//TODO remove 
		this.allCards = [
			new Card("Sprint", {initialActions: 1, actionName: "Sprint", actionToEnhance: "Move"}), 
			new Card("Drible", {initialActions: 1, actionName: "Drible", actionToEnhance: "Move"}), 
			new Card("Fall Back", {initialActions: 2, actionName: "Sprint", actionToEnhance: "Move"}), 
			new Card("Counter Attack", {initialActions: 2, actionName: "Sprint", actionToEnhance: "Move"})
		];
		this.turnCards = [];
		////////////////////////////////////////////////////

		this.revealedCards = [];
		this.actionedCards = [];
		this.cardsLeft = 0;
	};

	Emitter.mixInto(CardController);

	CardController.prototype.newTurn = function() {
		this.revealedCards = getNewTurnCards.call(this);
		this.actionedCards = [];

		//TODO ask the server
		this.cardsLeft = this.allCards.length;

		changeCardState.call(this);
	};

	CardController.prototype.revealedCardClicked = function(revealedCardIndex) {
		this.actionedCards = this.actionedCards.concat(this.revealedCards.splice(revealedCardIndex, 1));

		changeCardState.call(this);
	};

	CardController.prototype.actionedCardClicked = function(index) {
		var card = this.actionedCards[index];
		if (card.actionsLeft === 0) {
			return;
		}

		var onUserSelected = function() {
			this.actionedCards[index].actionsLeft--;
			changeCardState.call(this);
		};

		UserAreaController.cardActioned(card, onUserSelected.bind(this));
	};

	CardController.prototype.actionedCardClosed = function(actionedCardIndex) {
		var card = this.actionedCards.splice(actionedCardIndex, 1)[0];
		card.actionsLeft = findCard(card, this.turnCards).actionsLeft;

		//UserAreaController.cardActionDeselected(card);

		this.revealedCards = this.revealedCards.concat(card);

		changeCardState.call(this);
	};

	function changeCardState() {
		var state = {
			cardCount: this.cardsLeft,
			revealedCards: this.revealedCards,
			actionedCards: this.actionedCards
		}

		this.trigger("cards-changed", state);
	};

	function findCard(card, cards) {
		var foundCard = null;
		for(var i = 0, len = cards.length; i < len; i++) {
			if (cards[i].equals(card)) {
				foundCard = cards[i];
				break;
			}
		}

		return foundCard;
	};

	function getNewTurnCards () {
		//TODO get cards from server
		var card = this.allCards.pop();
		this.turnCards.push(card);
		////////////////////////////////////////////////////

		var clonedTurnCards = [];
		this.turnCards.forEach(function (card) {
			clonedTurnCards.push(card.clone());
		});

		return clonedTurnCards;
	};

	return new CardController();
});