define(["Emitter"], function(Emitter) {
	"use strict";

	var StateHandler = function() {};

	Emitter.mixInto(StateHandler);

	StateHandler.prototype.loadStaticContext = function() {
		this.trigger("load-static-state");
	};

	StateHandler.prototype.loadState = function(state, isInitial) {
		// Maybe stract to helper function -> var state = new StateHelper(state);
		processState.call(this);
		
		if (isInitial) {
			this.trigger("load-initial-state", this);
		} else {
			this.trigger("load-state", this);
		}
	};

	function processState(state) {

	};

	//Methods to get state information or to modify state


	return StateHandler;

});

