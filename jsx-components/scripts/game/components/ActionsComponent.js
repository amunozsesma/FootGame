define(["react", "utils/Utils", "game/UserAreaController"], function (React, Utils, Controller) {
	"use strict";

	var ActionsComponent = React.createClass({
		getInitialState: function() {
			return {
				playerName: "aPlayer",
				stats: [{name: "stat1", value: 1}, {name: "stat2", value: 2}, {name: "stat3", value: 3}, {name: "stat4", value: 4}],
				actions: ["action1", "action2", "action3", "action4"],
				selectedAction: null
			};
		},

		onButtonClicked: function(actionName) {
			this.setState({selectedAction: actionName});
		},

		render: function() {
			return (
				<div className="actions skeleton">
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