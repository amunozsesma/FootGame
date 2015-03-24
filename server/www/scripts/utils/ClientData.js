define(function() {
	"use strict";

	var ClientData = function() {
	};

	var data = {};

	ClientData.prototype.set = function(key, value) {
		data[key] = value;
		return this;
	};

	ClientData.prototype.get = function(key) {
		var value = null;

		if (Object.keys(data).indexOf(key) !== -1) {
			value = data[key];
		} else {
			console.log("'" + key + "' does not exist in the ClientData.");
		}

		return value;
	};

	return new ClientData();
});