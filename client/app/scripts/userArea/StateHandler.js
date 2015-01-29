define(["Emitter"], function(Emitter) {
	"use strict";

	var StateHandler = function() {};

	Emitter.mixInto(StateHandler);

	StateHandler.prototype.loadStaticContext = function() {
		this.trigger("loadStaticState");
	};

	StateHandler.prototype.loadState = function(state) {

	};

	return StateHandler;

});