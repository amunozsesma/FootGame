define(function () {
	"use strict";

	var Card = function(name, data) {
		this.name = name;
		this.initialActions 	= data.initialActions;
		this.actionName 		= data.actionName;
		this.actionToEnhance 	= data.actionToEnhance;
		this.description 		= data.description;
		this.resolutionStrategy = data.resolutionStrategy;
		this.resolutionParams 	= data.resolutionParams;
		
		this.resetActions();
	};

	Card.prototype.resetActions = function() {
		this.actionsLeft = this.initialActions;
	};

	Card.prototype.clone = function() {
		return new Card(this.name, {
			initialActions: 	this.initialActions, 
			actionName: 		this.actionName, 
			actionToEnhance: 	this.actionToEnhance,
			description: 		this.description,
			resolution: 		this.resolution,
			resolutionStrategy: this.resolutionStrategy,
			resolutionParams: 	this.resolutionParams
		});
	};

	Card.prototype.equals = function(card) {
		return this.name === card.name;
	};

	return Card;
});