define(["react", "utils/Utils", "game/UserAreaController"], function (React, Utils, Controller) {
	"use strict";

	var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	var PitchComponent = React.createClass({
		getInitialState: function() {
			return {
				ballPosition: null,
				userPlayers: null,
				rivalPlayers: null,
				actionPosibilities: null,
				actionSelections: null,
				actionedCards: null,
				selectedCell: null,
				isSelecting: false
			};
		},

		setInitialState: function(data) {
			this.setState({
				ballPosition: 	data.message.getBallPosition(),
				userPlayers: 	data.message.getUserPlayerPositions(),
				rivalPlayers: 	data.message.getRivalPlayerPositions(),
				actionPosibilities: null,
				actionSelections: 	null,
				selectedCell: 		null,
				isSelecting: false
			});
		},

		setShowSelections: function(data) {
			this.setState({
				actionSelections: data.state.getCurrentSelections(),
				selectedCell: data.state.getSelectedPlayerPosition(),
				actionPosibilities: null,
				isSelecting: false
			});
		},

		setShowPosibilities: function(data) {
			this.setState({
				actionPosibilities: data.state.getActionPosibilities(),
				selectedCell: null,
				actionSelections: null,
				isSelecting: true
			});
		},

		setCardPosibilities: function(data) {
			this.setState({
				actionPosibilities: data.state.getCardPosibilities()
			});
		},

		setActionedCards: function(data) {
			this.setState({
				actionedCards: data.state.getActionedCards()
			});
		},

		componentWillMount: function() {
			Controller.on("load-state",			 this.setInitialState	  );
			Controller.on("player-selected", 	 this.setShowSelections   );
			Controller.on("posibility-selected", this.setShowSelections   );
			Controller.on("action-selected", 	 this.setShowPosibilities );
			Controller.on("action-unselected", 	 this.setInitialState	  );
			Controller.on("player-unselected",	 this.setInitialState	  );
			Controller.on("card-selected",	 	 this.setCardPosibilities );
			Controller.on("card-actioned",	 	 this.setActionedCards	  );
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
							actionedCards={!!cell.actionedCards}
							cellStyle={cellStyle}
							isSelected={!!cell.isSelected}
							isEmptyCellClickabel={!this.state.isSelecting}/>
					);
				}
			}

			return cells;
		},

		render: function() {
			var cellMatrix = this.createCellMatrix();
			this.addProperties(cellMatrix, "userPlayer"			, this.state.userPlayers);
			this.addProperties(cellMatrix, "rivalPlayer"		, this.state.rivalPlayers);
			this.addProperties(cellMatrix, "ball"				, [this.state.ballPosition]);
			this.addProperties(cellMatrix, "actionPosibility"	, this.state.actionPosibilities);
			this.addProperties(cellMatrix, "actionSelection"	, this.state.actionSelections);
			this.addProperties(cellMatrix, "actionedCards"		, this.state.actionedCards);
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
			if (this.props.actionPosibility) {
				Controller.posibilityClicked(this.props.posX, this.props.posY);
			} else if (this.props.userPlayer || this.props.rivalPlayer) {
				Controller.playerClicked(this.props.posX, this.props.posY);
			} else if (this.props.isEmptyCellClickabel){
				Controller.emptyCellClicked();
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
				"card-actioned": this.props.actionedCards,
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

	return <PitchComponent columns="11" rows="5"/>;
});
