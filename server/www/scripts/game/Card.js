define(function () {
	"use strict";

	var Card = function(name, data) {
		this.name = name;
		this.initialActions = data.initialActions;
		this.actionName = data.actionName;
		this.actionToEnhance = data.actionToEnhance;
		this.resetActions();
	};

	Card.prototype.resetActions = function() {
		this.actionsLeft = this.initialActions;
	};

	Card.prototype.clone = function() {
		return new Card(this.name, {initialActions: this.initialActions, actionName: this.actionName, actionToEnhance: this.actionToEnhance});
	};

	Card.prototype.equals = function(card) {
		return this.name === card.name;
	};

	Card.prototype.getActionName = function() {
		return this.actionName;
	};

	Card.prototype.getActionToEnhance = function() {
		return this.actionToEnhance;
	};	

	return Card;
});