define(["Emitter"], function(Emitter) {
	"use strict";

	var InfoService = function(infoElement, stateHandler) {
		this.infoElement = infoElement;
		this.stateHandler = stateHandler;
	};

	InfoService.prototype.drawGeneralInfo = function() {
		console.log("Not implemented: drawGeneralInfo");
	};

	return InfoService;

});
