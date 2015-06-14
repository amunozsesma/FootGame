define(["react", "utils/Utils"], function (React, Utils) {
	"use strict";

	var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	var PitchComponent = React.createClass({
		getInitialState: function() {
			return {
				ballPosition: null,
				userPlayers: null,
				rivalPlayers: null,
				mode: null,
				actionPosibilities: null,
				actionSelections: null
			};
		},

		createCellMatrix: function() {
			var cells = [];
			var columns = parseInt(this.props.columns);
			var rows = parseInt(this.props.rows);

			for (var x = 0; x < columns; x++) {
				for (var y = 0; y < rows; y++) {
					cells.push({posX: x, posY: y});
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

		render: function() {
			var cellMatrix = this.createCellMatrix();
			var cellStyle = {height: 100/this.props.rows + "%", width: 100/this.props.columns + "%"};
			
			this.addProperties(cellMatrix, "userPlayer"			, this.state.userPlayers);
			this.addProperties(cellMatrix, "rivalPlayer"		, this.state.rivalPlayers);
			this.addProperties(cellMatrix, "ball"				, [this.state.ballPosition]);
			this.addProperties(cellMatrix, "actionPosibility"	, this.state.actionPosibilities);
			this.addProperties(cellMatrix, "actionSelection"	, this.state.actionSelections);

			var cells = []
			cellMatrix.forEach(function(cell) {
				cells.push(
					<Cell posX={cell.posX} posY={cell.posY} userPlayer={!!cell.userPlayer} rivalPlayer={!!cell.rivalPlayer} ball={!!cell.ball} actionPosibility={!!cell.actionPosibility} actionSelection={!!cell.actionSelection} cellStyle={cellStyle}/>
				);
			});

			return (
				<div className="pitch">
					{cells}
				</div>
			);
		}
	});

	var Cell = React.createClass({
		getInitialState: function() {
			return {
				isSelected: false
			};
		},

		onCellClicked: function() {
			if (!this.props.actionPosibility) {
				this.setState({isSelected: true});
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
				"selected": this.state.isSelected
			});

			return (
				<div className="cell skeleton" style={this.props.cellStyle} onClick={this.onCellClicked}>
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

//cell:
// done by himself --> selected, player (+ child), action-posibility, action-selected, child .ball