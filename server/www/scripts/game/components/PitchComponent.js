define(function() {
  "use strict";

	var PitchComponent = function(pitchElement, userAreaController) {
		this.pitchElement = pitchElement;
		this.userAreaController = userAreaController;

		// createReactElements.call(this);
    init.call(this);
    this.userAreaController.on("load-state", loadState, this);
    this.userAreaController.on("player-selected", selectPlayer, this);
    this.userAreaController.on("player-unselected", unselectPlayer, this);
    this.userAreaController.on("action-clicked", onActionSelected, this);
    this.userAreaController.on("action-state-changed", onActionStateChanged, this);
  };

  function init() {
    var own = this;

    var pitchComponent = React.createClass({
     getInitialState: function() {
       return {
            "userAreaController": own.userAreaController, //pitch
    				"dimensions": {"columns": 1, "rows": 1},      //pitch
            "userPlayers": {},                            //pitch
            "selectActionState": false,                   //pitch
            "rivalPlayers": {},                           //pitch
            "selectedPlayerPosition": null,
            "posibleActions": [],
            "selectedActionPosition": null,
            "ballPosition": {"x": 0, "y": 0}
          };
        },
        render: function() {
          var rowElements = this.loadField();
          var className = "pitch" + ((this.state.selectActionState) ? " slected-action-state" : "");
          className += (this.state.selectedPlayerPosition) ? " player-selected" : "";
  				return React.createElement("div", { className: className }, rowElements);
  			},
        cellClicked: function(x, y) {
          this.state.userAreaController.cellClicked(x, y);
        },
  			loadField: function() {
  				var rows = this.state.dimensions.rows;
  				var columns = this.state.dimensions.columns;
  				var rowElements = [];
  				var columnElements = [];
  				for (var i = 0; i < rows; i++) {
  					columnElements = [];
  					for (var j = 0; j < columns; j++) {
              var cell = this.createCell(j, i);
              columnElements.push(cell);
            } 
            rowElements.push(React.createElement("div", { className: 'row', style: {width: "100%", height:100/rows + "%" } }, columnElements));
          }

          return rowElements;
        },
        createCell: function(x, y) {
          var rows = this.state.dimensions.rows;
          var columns = this.state.dimensions.columns;
          var player = this.createPlayerIfNeeded(x, y);
          var className = "cell skeleton";
          className += (player) ? " player" : "";
          className += (this.state.selectedPlayerPosition && this.state.selectedPlayerPosition.x === x && this.state.selectedPlayerPosition.y === y) ? " selected" : "";
          className += (this.state.selectActionState && this.isPosibilityCell(x, y)) ? " action-posibility" : "";
          className += (this.state.selectedActionPosition && this.state.selectedActionPosition.x === x && this.state.selectedActionPosition.y === y) ? " action-selected" : "";

          var sons = [player];
          if (this.state.ballPosition.x === x && this.state.ballPosition.y === y) {
            sons.push(React.createElement("div", {className: "ball"}));
          }
          return React.createElement("div", { onClick:this.cellClicked.bind(this, x, y), className: className, style: {width: 100/columns + "%", height:"100%", float: "left"} }, sons);
        },
  			createPlayerIfNeeded: function(x, y) {
  				var player = null;
  				var userPlayersLength = Object.keys(this.state.userPlayers).length;
  				if (userPlayersLength !== 0) {
  					player = this.loadPlayer(this.state.userPlayers, x, y, 'mine fa fa-child');
  					if (!player) {
  						player = this.loadPlayer(this.state.rivalPlayers, x, y, 'rival fa fa-child');
  					}
  				}

  				return player;
  			},
  			loadPlayer: function(playerMap, x, y, className) {
  				var player = null;
  				for (var playerName in playerMap) {
  					if (playerMap[playerName].x === x && playerMap[playerName].y === y) {
  						return React.createElement("div", {className: className});
  					}
  				}
  			},
        isPosibilityCell: function(x, y) {
          for (var i = 0, len = this.state.posibleActions.length; i < len; i++) {
            var cell = this.state.posibleActions[i];
            if (cell.x === x && cell.y === y) {
              return true;
            }
          }
        }


		});

		var pitchElement = React.createElement(pitchComponent);
		this.reactComponent = React.render(pitchElement, this.pitchElement);
	};

  //TODO REFACTOR have only a single call that updates full state
	function loadState(userAreaController) {
		this.reactComponent.setState({
			"dimensions": userAreaController.getDimensions(),
			"userPlayers": userAreaController.getUserPlayerPositions(),
			"rivalPlayers": userAreaController.getRivalPlayerPositions(),
      "ballPosition": userAreaController.getBallPosition(),
      "selectedPlayerPosition": null,
      "posibleActions": [],
      "selectedActionPosition": null,
      "selectActionState": false
		});	
	};

  function selectPlayer(userAreaController) {
    this.reactComponent.setState({
      "selectedPlayerPosition": userAreaController.getSelectedPlayerPosition(),
      "selectedActionPosition": userAreaController.getSelectedActionPosition()
    });
  };

  function unselectPlayer(userAreaController) {
    this.reactComponent.setState({
      "selectedPlayerPosition": null
    });
  };

  function onActionSelected(userAreaController) {
    this.reactComponent.setState({
      "posibleActions": userAreaController.getActionPosibilities()
    });
  };

  function onActionStateChanged(userAreaController) {
    this.reactComponent.setState({
      "selectActionState": userAreaController.getSelectActionState(),
      "selectedActionPosition": userAreaController.getSelectedActionPosition()
    });
  };
	
	return PitchComponent; 
});
