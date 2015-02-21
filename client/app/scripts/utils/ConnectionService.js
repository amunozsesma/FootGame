define(["game/MockTurnResolver", "config"], function(TurnResolver, config) {
	"use strict";
	function ConnectionService () {
	};

	ConnectionService.prototype.connect = function() {

	};

	ConnectionService.prototype.disconnect = function() {

	};	

	ConnectionService.prototype.startGameConnection = function(callback) {
		if (config.mocks) {
			callback(config.mockMessage);
		}
	};

	ConnectionService.prototype.sendEndOfTurnResult = function(previousMessage, message, callback) {
		if (config.mocks) {
			var turnResolver = new TurnResolver(previousMessage, message, callback); 
			turnResolver.resolveTurn("SIMPLE_CONFLICTS");
		}
	};

	return new ConnectionService(); 
});