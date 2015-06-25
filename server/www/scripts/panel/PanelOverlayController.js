define(["react"], function(React) {
	"use strict";
	function PanelOverlaycontroller () {
		this.container = document.getElementById("overlay-container");
		this.panelOverlay = createPanelOverlay.call(this);
	};

	PanelOverlaycontroller.prototype.show = function(message) {
		this.panelOverlay.setState({
			message: message,
			isHidden: false
		});
	};

	PanelOverlaycontroller.prototype.hide = function() {
		this.panelOverlay.setState({
			isHidden: true
		});
	};

	function createPanelOverlay() {
		var component = React.createClass({
			getInitialState: function() {
				return {
					message: "",
					isHidden: true
				};
			},
			render: function() {
				var overlayInfo = this.createOverlayInfo();
				return React.createElement("div", {className: "panel overlay", style: {
					display: (this.state.isHidden) ? "none" : "block"
				}}, overlayInfo);
			},
			createOverlayInfo: function() {
				var message = React.createElement("div", {className: "message"}, this.state.message);
				var spinner = React.createElement("div", {className: "spinner"});
				return React.createElement("div", {className: "info"}, [message, spinner]);
			}
		});
		var panelOverlay = React.createElement(component);
		return React.render(panelOverlay, this.container);
	}

	return new PanelOverlaycontroller(); 
});