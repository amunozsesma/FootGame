define(["Emitter"], function(Emitter) {
	"use strict";

	var PitchService = function(pitchElement, stateHandler) {
		this.pitchElement = pitchElement;
		this.stateHandler = stateHandler;

		// createReactElements.call(this);
		this.stateHandler.on("load-static-state", init, this);
		this.stateHandler.on("load-initial-state", loadState, this);
	};

	function init() {
		var self = this;
		
		var pitchComponent = React.createClass({
  			getInitialState: function() {
    			return {
    				"dimensions": {"columns": 1, "rows": 1},
    				"players": {}
    			};
  			},
  			render: function() {
  				
  				var rows = this.state.dimensions.rows;
  				var columns = this.state.dimensions.columns;
  				var rowElements = [];
  				var columnElements = [];
  				for (var i = 0; i < rows; i++) {
  					columnElements = [];
  					for (var j = 0; j < columns; j++) {
  						columnElements.push(React.createElement("div", { className: 'pitchColumn skeleton green', style: {width: 100/columns + "%", height:"100%", float: "left"} }));
  					}	
  					rowElements.push(React.createElement("div", { className: 'pitchRow skeleton green', style: {width: "100%", height:100/rows + "%" } }, columnElements));
  				}
  				
  				return React.createElement("div", { className: 'pitch' }, rowElements);
  			}
		});

		var pitchElement = React.createElement(pitchComponent);
		this.reactComponent = React.render(pitchElement, this.pitchElement);
	};

	function loadState(stateHandler) {
		//get needed from stateHandler
		// this.reactComponent.setState();	
	};
	

	Emitter.mixInto(PitchService);

	return PitchService; 
});
