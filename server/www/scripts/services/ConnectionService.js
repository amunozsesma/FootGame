define(["config"], function(config) {
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
			console.log("Disconnected :(");
			//TODO reconnection
			//PanelOverlayController.showOverlay({
				// 	title: "Connecting lost to Server, reconnecting...",
				// 	loader: "spinner"
			// });
		});

		console.log("Connected :)");
		callback();
	};
	
	return new ConnectionService(); 
});