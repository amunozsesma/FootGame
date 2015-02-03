// ActionService(actionsContainerElement)
// showActions(actions);
// hideActions();

// addListener({
// 	actionSelected(action),

// })

define(["Emitter"], function(Emitter) {
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

		var actionsComponent = React.createClass({
  			getInitialState: function() {
    			return {
            		"stateHandler": own.stateHandler,
            		"isHidden": true
    			};
  			},
  			render: function() {
  				var descriptionContainer = this.createDescriptionContainer();
  				var className = "actions skeleton" + ((this.state.isHidden) ? " isHidden" : "");
  				return React.createElement("div", { className: className}, [descriptionContainer]);
  			},
  			createDescriptionContainer: function() {
  				var name = React.createElement("div", { className: "name"}, this.state.stateHandler.getPlayerInMenu());
  				var photoConainer = this.createPhotContainer();
  				return React.createElement("div", { className: "description-container"}, [name, photoConainer]);	
  			},
  			createPhotContainer: function() {
  				var image = this.state.stateHandler.getPlayerImage();
  				var props = {
  					className: "skeleton photo-container"
  				};
  				// if (image) {
  				// 	props["style"] = {
  				// 		"background-image": "url(" + image + ")"
  				// 	}
  				// }
  				return React.createElement("div", props);
  			}

		});

		var actionsElement = React.createElement(actionsComponent);
		this.reactComponent = React.render(actionsElement, this.actionsElement);
	};

	function showMenu() {
		this.reactComponent.setState({
			"isHidden": false
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

