define(["game/MockTurnResolver", "config"], function(TurnResolver, config) {
	"use strict";
	function ConnectionService () {
	};

	ConnectionService.prototype.connect = function(callback) {
		this._socket = io();
		this._socket.on("connect", onConnectionStablished.bind(this, callback));
	};

	ConnectionService.prototype.send = function(eventName, data) {
		this._socket.emit(eventName, data);	
	};

	ConnectionService.prototype.subscribe = function(eventName, callback) {
		this._socket.on(eventName, callback);
	};

	function onConnectionStablished(callback) {
		this._socket.on("disconnect", function() {
			console.log("server disconnected");
			//TODO reconnection
			//PanelOverlayController.showOverlay({
				// 	title: "Connecting lost to Server, reconnecting...",
				// 	loader: "spinner"
			// });
		});

		console.log("socket created");
		callback();
	};
	

	//TODO remove all of the below as they are helper methods (they should live in each of the classes)
	ConnectionService.prototype.teamNameSelected = function(teamName) {
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