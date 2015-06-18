define(["react", "utils/Utils", "game/UserAreaController"], function (React, Utils, Controller) {
	"use strict";

	var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	var PitchComponent = React.createClass({
		getInitialState: function() {
			return {
				ballPosition: {x: 5, y: 2},
				userPlayers: [{x:2, y:0}, {x:2, y:2}, {x:2, y:4}],
				rivalPlayers: [{x: 8, y:0}, {x: 8, y:2}, {x: 8, y:4}],
				actionPosibilities: [{x: 8, y:0}, {x: 8, y:2}, {x: 8, y:4}],
				actionSelections: [{x: 3, y: 4}],
				selectedCell: null
			};
		},

		setInitialState: function(userAreaHelper) {
			this.setState({
				ballPosition: 	userAreaHelper.getBallPosition(),
				userPlayers: 	userAreaHelper.getUserPlayerPositions(),
				rivalPlayers: 	userAreaHelper.getRivalPlayerPositions(),
				actionPosibilities: null,
				actionSelections: 	null,
				selectedCell: 		null
			});
		},

		setShowSelections: function(userAreaHelper) {
			this.setState({
				actionSelections: userAreaHelper.getCurrentSelections()
			});
		},

		setShowPosibilities: function(userAreaHelper) {
			this.setState({
				actionPosibilities: userAreaHelper.getActionPosibilities()
			});
		},

		componentWillMount: function() {
			Controller.on("load-state",			 this.setInitialState	  );
			Controller.on("player-selected", 	 this.setShowSelections   );
			Controller.on("posibility-selected", this.setShowSelections   );
			Controller.on("action-selected", 	 this.setShowPosibilities );
			Controller.on("player-unselected",	 this.setInitialState	  );
			Controller.on("turn-end",	 		 this.setInitialState	  );
		},

		createCellMatrix: function() {
			var cells = [];
			var numberOfColumns = parseInt(this.props.columns);
			var numberOfRows = parseInt(this.props.rows);

			for (var x = 0; x < numberOfColumns; x++) {
				cells[x] = [];
				for (var y = 0; y < numberOfRows; y++) {
					cells[x].push({posX: x, posY: y});
				}
			}

			return cells;
		},

		addProperties: function(cellMatrix, propertyName, positions) {
			if (positions && positions[0]) {
				positions.forEach(function(position) {
					cellMatrix[position.x][position.y][propertyName] = true;
				});
			}
		},

		createCellArray: function(cellMatrix) {
			var numberOfColumns = parseInt(this.props.columns);
			var numberOfRows = parseInt(this.props.rows);
			var cellStyle = {height: 100/numberOfRows + "%", width: 100/numberOfColumns + "%"};
			var cells = [];
			var cell = null;
			
			for (var y = 0; y < numberOfRows; y++) {
				for (var x = 0; x < numberOfColumns; x++) {
					cell = cellMatrix[x][y];
					cells.push(
						<Cell 
							posX={cell.posX} 
							posY={cell.posY} 
							userPlayer={!!cell.userPlayer} 
							rivalPlayer={!!cell.rivalPlayer} 
							ball={!!cell.ball} 
							actionPosibility={!!cell.actionPosibility} 
							actionSelection={!!cell.actionSelection} 
							cellStyle={cellStyle}
							isSelected={!!cell.isSelected}
							selected={this.onCellSelected}/>
					);
				}
			}

			return cells;
		},

		onCellSelected: function(posX, posY) {
			this.setState({selectedCell: {x: posX, y: posY}})
		},

		render: function() {
			var cellMatrix = this.createCellMatrix();
			
			this.addProperties(cellMatrix, "userPlayer"			, this.state.userPlayers);
			this.addProperties(cellMatrix, "rivalPlayer"		, this.state.rivalPlayers);
			this.addProperties(cellMatrix, "ball"				, [this.state.ballPosition]);
			this.addProperties(cellMatrix, "actionPosibility"	, this.state.actionPosibilities);
			this.addProperties(cellMatrix, "actionSelection"	, this.state.actionSelections);
			this.addProperties(cellMatrix, "isSelected"			, [this.state.selectedCell]);

			var cells = this.createCellArray(cellMatrix);

			return (
				<div className="pitch">
					{cells}
				</div>
			);
		}
	});

	var Cell = React.createClass({
		onCellClicked: function() {
			if (!this.props.actionPosibility && (this.props.userPlayer || this.props.rivalPlayer)) {
				this.props.selected(this.props.posX, this.props.posY);
			}
		},

		generateChilds: function(isUserPlayer, isRivalPlayer, isBall) {
			var childs = [];
			isUserPlayer && childs.push(<div className="mine fa fa-child"></div>);
			isRivalPlayer && childs.push(<div className="rival fa fa-child"></div>);
			isBall && childs.push(<div className="ball"></div>);

			return childs;
		},

		render: function() {
			var childs = this.generateChilds(this.props.userPlayer, this.props.rivalPlayer, this.props.ball);
			var className = Utils.reactClassAppender({
				"action-selected": this.props.actionSelection,
				"action-posibility": this.props.actionPosibility,
				"player": this.props.userPlayer || this.props.rivalPlayer,
				"selected": this.props.isSelected
			}, "cell skeleton");

			return (
				<div className={className} style={this.props.cellStyle} onClick={this.onCellClicked}>
					{childs}
				</div>
			);
		}
	});

	return PitchComponent;
});

//Controller modes:
// - initial (userplayers, rivalplayers, ball)
// - cell-selection (mark posibilities and handlers on those posibilities)
// - player-selected (mark player, show selected cells)

// - {initialize: size, teams, scores}
// - {mode: cell-selection, [posibilities]}
// - {mode: player-selected, {position, actions, selectedaction, posibilities, name, stats}}
// - modes are internal pitch component states to prevent clicking in other things

//cell:
// done by himself --> selected, player (+ child), action-posibility, action-selected, child .ball