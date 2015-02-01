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
    				"userPlayers": {},
    				"rivalePlayers": {}
    			};
  			},
  			render: function() {
  				var rowElements = this.loadField();
  				return React.createElement("div", { className: 'pitch' }, rowElements);
  			},
  			loadField: function() {
  				var rows = this.state.dimensions.rows;
  				var columns = this.state.dimensions.columns;
  				var rowElements = [];
  				var columnElements = [];
  				for (var i = 0; i < rows; i++) {
  					columnElements = [];
  					for (var j = 0; j < columns; j++) {
  						var player = this.createPlayerIfNeeded(j, i);
  						columnElements.push(React.createElement("div", { className: 'pitchColumn skeleton green', style: {width: 100/columns + "%", height:"100%", float: "left"} }, player));
  					}	
  					rowElements.push(React.createElement("div", { className: 'pitchRow skeleton green', style: {width: "100%", height:100/rows + "%" } }, columnElements));
  				}

  				return rowElements;
  			},
  			createPlayerIfNeeded: function(x, y) {
  				var player = null;
  				var userPlayersLength = Object.keys(this.state.userPlayers).length;
  				if (userPlayersLength !== 0) {
  					player = this.loadPlayer(this.state.userPlayers, x, y, 'mine');
  					if (!player) {
  						player = this.loadPlayer(this.state.rivalPlayers, x, y, 'rival');
  					}
  				}

  				return player;
  			},
  			loadPlayer: function(playerMap, x, y, className) {
  				var player = null;
  				for (var playerName in playerMap) {
  					if (playerMap[playerName].x === x && playerMap[playerName].y === y) {
  						return React.createElement("span", {className: "player " + className}, playerName);
  					}
  				}
  			}


		});

		var pitchElement = React.createElement(pitchComponent);
		this.reactComponent = React.render(pitchElement, this.pitchElement);
	};

	function loadState(stateHandler) {
		//get needed from stateHandler
		this.reactComponent.setState({
			"dimensions": stateHandler.getDimensions(),
			"userPlayers": stateHandler.getUserPlayerPositions(),
			"rivalPlayers": stateHandler.getRivalPlayerPositions()
		});	
	};
	

	Emitter.mixInto(PitchService);

	return PitchService; 
});
