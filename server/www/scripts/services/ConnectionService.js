define(["config", "panel/PanelOverlayController"], function(config, PanelOverlay) {
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
			//TODO heartbeats
			console.log("Disconnected :(");
			PanelOverlay.show("Connection lost, reconnecting...");
		});

		console.log("Connected :)");
		callback();
	};
	
	return new ConnectionService(); 
});