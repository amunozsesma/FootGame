define(["react", "utils/Utils", "game/UserAreaController"], function (React, Utils, Controller) {
	"use strict";

	var InfoComponent = React.createClass({
		getInitialState: function() {
			return {
				score: []
			};
		},

		setScore: function(data) {
			this.setState({
				score: data.message.getTeamScores()
			});
		},

		componentWillMount: function() {
			Controller.on("load-state",	this.setScore);
		},

		render: function() {
			var scores = this.state.score.map(function(score) {
				return (
					<div className="team-score-container">
						<div className="team-score-element">{score.teamName}</div>
						<div className="team-score-element">{score.goals}</div>
					</div>
				);
			});

			return (
				<div className="info">
					<div className="score-container skeleton">
						{scores}
					</div>
					<Timeout />
				</div>
			);
		}
	});

	var Timeout = React.createClass({
		getInitialState: function() {
			return {
				timeout: 0,
				overallTimeout: 1,
				message: "",
				complete: false 
			};
		},

		setInitalState: function() {
			this.setState({
				timeout: 0,
				overallTimeout: 1,
				message: "Click to end your turn",
				complete: false 	
			});
		},

		setTimeout: function(data) {
			this.setState(data);
		},

		setTurnEnd: function() {
			this.setState({
				message: "Waiting for other player",
				complete: true
			});
		},

		componentWillMount: function() {
			Controller.on("load-state",			this.setInitalState );
			Controller.on("timeout-adjustment",	this.setTimeout		);
			Controller.on("turn-end",			this.setTurnEnd 	);
		},

		onClick: function() {
			Controller.endTurn();
		},

		render: function() {
			var style = {width: (this.state.complete) ? "100%" : this.state.timeout/this.state.overallTimeout * 100 + "%"};
			var className = Utils.reactClassAppender({
				"turn-end": this.state.complete
			}, "turn-progress-bar");

			return (
				<div className="timeout-container skeleton" onClick={this.onClick}>
					<div className={className} style={style}></div>
					<span className="progress-bar-message">{this.state.message}</span>
				</div>
			);
		}
	});

	return <InfoComponent />;
});
