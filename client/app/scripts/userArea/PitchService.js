define(["Emitter"], function(Emitter) {
	"use strict";

	var PitchService = function(pitchElement, stateHandler) {
		this.pitchElement = pitchElement;
		this.stateHandler = stateHandler;

		createReactElements.call(this);
		this.stateHandler.on("loadStaticState", initReactComponent, this);
	};

	function createReactElements() {
		this.pitch = React.createElement('div', { className: 'pitch skeleton green' });
	};
	
	function initReactComponent() {
		React.render(this.pitch, this.pitchElement);		
	};


	Emitter.mixInto(PitchService);

	return PitchService; 
});
