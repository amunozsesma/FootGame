define(["react", "utils/Utils", "game/UserAreaController"], function (React, Utils, Controller) {
	"use strict";

	var ActionsComponent = React.createClass({
		getInitialState: function() {
			return {
				playerName: "aPlayer",
				stats: [],
				actions: ["action1", "action2", "action3", "action4"],
				selectedAction: null,
				isHidden: false
			};
		},

		setHidden: function(isHidden) {
			this.setState({isHidden: isHidden});
		},

		componentWillMount: function() {
			Controller.on("load-state",			this.setHidden.bind(this, true)  );
			Controller.on("player-selected",	this.setHidden.bind(this, false) );
			Controller.on("player-unselected",	this.setHidden.bind(this, true)  );
			Controller.on("turn-end",			this.setHidden.bind(this, true)  );
		},

		onButtonClicked: function(actionName) {
			this.setState({selectedAction: actionName});
			// Controller.action(actionName);
		},

		render: function() {
			var className = Utils.reactClassAppender({
				"isHidden": this.state.isHidden
			}, "actions skeleton");

			return (
				<div className={className}>
					<Description name={this.state.playerName}/>
					<Stats stats={this.state.stats}/>
					<Buttons actions={this.state.actions} selected={this.state.selectedAction} clickHandler={this.onButtonClicked}/>
				</div>
			);
		}
	});

	var Description = React.createClass({
		render: function() {
			return (
				<div className="description-container">
					<div className="name">{this.props.name}</div>
					<div className="skeleton photo-container"></div>
				</div>
			);
		}
	});

	//This will probably be replaced by type of player and stamina
	var Stats = React.createClass({
		render: function() {
			var stats = this.props.stats.map(function(stat) {
				return (
					<div className="stat-container">
						<div className="stat-name">{stat.name}</div>
						<div className="stat-value">{stat.value}</div>
					</div>
				)
			});

			return (
				<div className="player-stats-container">
					{stats}
				</div>
			);
		}
	});

	var Buttons = React.createClass({
		onButtonClicked: function(action) {
			this.props.clickHandler(action);
		},

		render: function() {
			var buttons = this.props.actions.map(function(action) {
				var clickHandler = this.onButtonClicked.bind(this, action);
				var className = Utils.reactClassAppender({
					"selected": this.props.selected === action
				}, "action-button");
				return <button className={className} onClick={clickHandler}>action</button>
			}, this);

			return (
				<div className="buttons-container" >
					{buttons}
				</div>
			);
		}
	});

	return ActionsComponent;
});