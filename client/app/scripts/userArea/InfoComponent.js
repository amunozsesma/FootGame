define(function() {
	"use strict";

	var InfoComponent = function(infoElement, userAreaController) {
		this.infoElement = infoElement;
		this.userAreaController = userAreaController;

		init.call(this);
		this.userAreaController.on("load-state", loadState, this);
		this.userAreaController.on("timeout-adjustment", adjustTimeout, this);
	};

	function init() {
		var own = this;

		var infoComponent = React.createClass({
  			getInitialState: function() {
    			return {
    				"userAreaController": own.userAreaController,
    				"teamScores": {},
    				"timeout": 0,
    				"overallTimeout": 1
    			};
  			},
  			render: function() {
  				var teamScores = this.createTeamScores();
  				return React.createElement("div", { className: 'info skeleton' }, teamScores);
  			},
  			createTeamScores: function() {
				var teamScores = [];
				Object.keys(this.state.teamScores).forEach(function(team, index) {
					var teamContainer = [];
					var teamName = React.createElement("div", { className: 'team-name' }, team);
					var teamScore = React.createElement("div", { className: 'team-score' }, this.state.teamScores[team]);
					
					if (index === 1) {
						teamScores.push(React.createElement("div", { className: 'separator' }, "-"));
						teamContainer = [teamScore, teamName];
					} else {
						teamContainer = [teamName, teamScore];
					}

					var scoreContainer = React.createElement("div", { className: 'score-container' }, teamContainer);
					var progressBar = React.createElement("div", { className: 'turn-progress-bar', style: {width: this.state.timeout/this.state.overallTimeout * 683 + "px"}});
					var timeoutContainer = React.createElement("div", { className: 'timeout-container', onClick: this.progressBarClicked }, progressBar);
					teamScores.push(scoreContainer, timeoutContainer);
				}.bind(this)); 

				return teamScores;
  			},
  			progressBarClicked: function() {
  				this.state.userAreaController.onUserClickedTurnEnd();
  			}
		});

		var infoElement = React.createElement(infoComponent);
		this.reactComponent = React.render(infoElement, this.infoElement);
	};

	function loadState(userAreaController) {
		this.reactComponent.setState({
			"teamScores": userAreaController.getTeamScores(),
		});
	};

	function adjustTimeout(ttl) {
		this.reactComponent.setState({
			"timeout": ttl.timeout,
			"overallTimeout": ttl.overallTimeout
		});	
	}

	return InfoComponent;

});
