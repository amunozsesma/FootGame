// ActionService(actionsContainerElement)
// showActions(actions);
// hideActions();

// addListener({
// 	actionSelected(action),

// })

define(["Emitter"], function(Emitter) {
	"use strict";

	var ActionService = function(actionsElement, stateHandler) {
		this.actionsElement = actionsElement;
		this.stateHandler = stateHandler;
	};

	return ActionService;

});

