// ActionsComponent(actionsContainerElement)
// showActions(actions);
// hideActions();

// addListener({
// 	actionSelected(action),

// })

define(function() {
	"use strict";

	var ActionsComponent = function(actionsElement, userAreaController) {
		this.actionsElement = actionsElement;
		this.userAreaController = userAreaController;

		init.call(this);
		this.userAreaController.on("player-selected", showMenu, this);
		this.userAreaController.on("player-unselected", hideMenu, this);
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
            		"userAreaController": own.userAreaController,
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
  				var name = React.createElement("div", { className: "name"}, this.state.userAreaController.getSelectedPlayer());
  				var photoConainer = this.createPhotContainer();
  				return React.createElement("div", { className: "description-container"}, [name, photoConainer]);	
  			},
  			createPhotContainer: function() {
  				var props = {
  					className: "skeleton photo-container"
  				};
  				var image = this.state.userAreaController.getPlayerImage();
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
  					var className = "action-button" + ((this.state.selectedAction === action) ? " selected" : "");
  					var props = {
              className: className,
              onClick: this.actionClicked.bind(this, action)
            }
            if (!this.state.userAreaController.canPerform(action)) {
              props.disabled = true;
            }
            var actionButton = React.createElement("button", props, action);
  					actionButtons.push(actionButton);
  				}.bind(this));

  				return React.createElement("div", {className: "buttons-container"}, actionButtons);
  			},
  			actionClicked: function(action) {
  				var selectedAction = (action !== this.state.selectedAction) ? action : "";
          this.state.userAreaController.actionClicked(selectedAction);
  				this.setState({"selectedAction": selectedAction});
  			}

		});

		var actionsElement = React.createElement(actionsComponent);
		this.reactComponent = React.render(actionsElement, this.actionsElement);
	};

	function showMenu(userAreaController) {
		this.reactComponent.setState({
			"isHidden": false,
			"playerStats": userAreaController.getPlayerStats(),
			"actions": userAreaController.getPlayerActions(),
			"selectedAction": userAreaController.getSelectedAction()
		});
	};

	function hideMenu() {
		this.reactComponent.setState({
			"isHidden": true,
      "actions": [],
      "playerStats": {},
      "selectedAction": ""
		});
	};

	function loadState(userAreaController) {
		this.reactComponent.setState({

		});	
	};
	

	return ActionsComponent;

});

