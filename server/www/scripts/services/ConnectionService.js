define(["config", "panel/PanelOverlayController", "utils/ClientData"], function(config, PanelOverlay, ClientData) {
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

	ConnectionService.prototype.unsubscribe = function(eventName, callback) {
		this._socket.off(eventName, callback);
	};

	function onConnectionStablished(callback) {
		ClientData.set("userId", this._socket.id);

		this._socket.on("disconnect", function() {
			console.log("Disconnected :(");
			PanelOverlay.show("Connection lost, reconnecting...");
		});

		console.log("Connected :)");
		callback();
	};
	
	return new ConnectionService(); 
});