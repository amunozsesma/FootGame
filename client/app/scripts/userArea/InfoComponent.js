define(function() {
	"use strict";

	var InfoComponent = function(infoElement, userAreaController) {
		this.infoElement = infoElement;
		this.userAreaController = userAreaController;

		init.call(this);
		this.userAreaController.on("load-initial-state", loadState, this);
	};

	function init() {
		var own = this;

		var infoComponent = React.createClass({
  			getInitialState: function() {
    			return {
    				"userAreaController": own.userAreaController,
    				"teamScores": {},
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
					teamScores.push(scoreContainer);
				}.bind(this)); 

				return teamScores;
  			}
		});

		var infoElement = React.createElement(infoComponent);
		this.reactComponent = React.render(infoElement, this.infoElement);
	};

	function loadState(userAreaController) {
		this.reactComponent.setState({
			"teamScores": userAreaController.getTeamScores()
		});
	};

	return InfoComponent;

});
