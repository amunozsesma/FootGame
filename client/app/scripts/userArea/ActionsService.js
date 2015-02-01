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
            		"below": true
    			};
  			},
  			render: function() {
  				var className = "actions skeleton blue" + ((this.state.below) ? " below" : "");
  				return React.createElement("div", { className: className});
  			}
		});

		var actionsElement = React.createElement(actionsComponent);
		this.reactComponent = React.render(actionsElement, this.actionsElement);
	};

	function showMenu() {
		this.reactComponent.setState({
			"below": false
		});
	};

	function hideMenu() {
		this.reactComponent.setState({
			"below": true
		});
	};

	function loadState(stateHandler) {
		this.reactComponent.setState({

		});	
	};
	

	return ActionService;

});

