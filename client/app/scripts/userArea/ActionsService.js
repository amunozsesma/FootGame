// ActionService(actionsContainerElement)
// showActions(actions);
// hideActions();

// addListener({
// 	actionSelected(action),

// })

define(function() {
	"use strict";

	var ActionService = function(actionsElement, stateHandler) {
		this.actionsElement = actionsElement;
		this.stateHandler = stateHandler;

		init.call(this);
		this.stateHandler.on("show-actions-menu", showMenu, this);
		this.stateHandler.on("hide-actions-menu", hideMenu, this);
	};

	function init() {
		var own = this;

		// var userPlayerComponent = React.createClass({
		// 	render: function(){}
		// });

		// var rivalPlayerComponent = React.createClass({
		// 	render: function(){}
		// });

		var actionsComponent = React.createClass({
  			getInitialState: function() {
    			return {
            		"stateHandler": own.stateHandler,
            		"isHidden": true,
            		"actions": [],
            		"playerStats": {},
            		"selectedAction": ""
    			};
  			},
  			render: function() {
  				var descriptionContainer = this.createDescriptionContainer();
  				var statsContainer = this.createStatsContainer();
  				var buttonsContainer = this.createButtonsContainer();
  				var className = "actions skeleton" + ((this.state.isHidden) ? " isHidden" : "");
  				return React.createElement("div", { className: className}, [descriptionContainer, statsContainer, buttonsContainer]);
  			},
  			createDescriptionContainer: function() {
  				var name = React.createElement("div", { className: "name"}, this.state.stateHandler.getPlayerInMenu());
  				var photoConainer = this.createPhotContainer();
  				return React.createElement("div", { className: "description-container"}, [name, photoConainer]);	
  			},
  			createPhotContainer: function() {
  				var props = {
  					className: "skeleton photo-container"
  				};
  				var image = this.state.stateHandler.getPlayerImage();
  				if (image) {
  					props["style"] = {
  						"background-image": "url(" + image + ")"
  					}
  				}
  				return React.createElement("div", props);
  			},
  			createStatsContainer: function() {
  				var stats = [];
  				Object.keys(this.state.playerStats).forEach(function(stat) {
					var statName = React.createElement("span", {className: "stat-name"}, stat);
					var statValue = React.createElement("span", {className: "stat-value"}, this.state.playerStats[stat]);
  					var statContainer = React.createElement("div", {className: "stat-container"}, [statName, statValue]);
  					stats.push(statContainer);
  				}.bind(this));
  				return React.createElement("div", {className: "player-stats-container"}, stats);
  			},
  			createButtonsContainer: function() {
  				var actionButtons = [];
  				this.state.actions.forEach(function(action) {
  					var className = "action-button";
  					className += (this.state.selectedAction === action) ? " selected" : "";
  					var actionButton = React.createElement("button", {className: className, onClick: this.actionClicked.bind(this, action)}, action);
  					actionButtons.push(actionButton);
  				}.bind(this));

  				return React.createElement("div", {className: "buttons-container"}, actionButtons);
  			},
  			actionClicked: function(action) {
  				this.state.stateHandler.actionClicked(action);
  				this.setState({"selectedAction":action});
  			}

		});

		var actionsElement = React.createElement(actionsComponent);
		this.reactComponent = React.render(actionsElement, this.actionsElement);
	};

	function showMenu(stateHandler) {
		this.reactComponent.setState({
			"isHidden": false,
			"playerStats": stateHandler.getPlayerStats(),
			"actions": stateHandler.getPlayerActions(),
			"selectedAction": stateHandler.getSelectedAction()
		});
	};

	function hideMenu() {
		this.reactComponent.setState({
			"isHidden": true
		});
	};

	function loadState(stateHandler) {
		this.reactComponent.setState({

		});	
	};
	

	return ActionService;

});

