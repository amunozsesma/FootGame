define(["game/MockTurnResolver"], function(TurnResolver) {
	"use strict";
	function ConnectionService (mockData) {
		if (mockData) {
			this.mockMessage = mockData.mockMessage;
			this.usingMocks = mockData.usesMocks;
		}
	};

	ConnectionService.prototype.connect = function(callback) {
		if (this.usingMocks) {
			callback(this.mockMessage);
		}
	};

	ConnectionService.prototype.sendEndOfTurnResult = function(previousMessage, message, callback) {
		if (this.usingMocks) {
			var turnResolver = new TurnResolver(previousMessage, message, callback); 
			turnResolver.resolveTurn("SIMPLE_CONFLICTS");
		}
	};

	return ConnectionService; 
});