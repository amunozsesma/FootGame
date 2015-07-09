define(function () {
	"use strict";

	var Card = function(name, data) {
		this.name = name;
		this.initialActions = data.initialActions;
		this.actionName = data.actionName;
		this.actionToEnhance = data.actionToEnhance;
		this.description = data.description;
		this.attributes = copyAttributes(data.attributes);
		this.resetActions();
	};

	Card.prototype.resetActions = function() {
		this.actionsLeft = this.initialActions;
	};

	Card.prototype.clone = function() {
		return new Card(this.name, {
			initialActions: this.initialActions, 
			actionName: this.actionName, 
			actionToEnhance: this.actionToEnhance,
			description: this.description,
			attributes: this.attributes
		});
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

	function copyAttributes(attributes) {
		var copiedAttributes = {};
		Object.keys(attributes).forEach(function(attributeName) {
			copiedAttributes[attributeName] = attributes[attributeName];
		});

		return copiedAttributes;
	}

	return Card;
});