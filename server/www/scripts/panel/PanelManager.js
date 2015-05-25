define(["config"], function(config) {
	function PanelManager(panelContainer) {
		this.loadedPanels = {};
		this.panelElements = {};
		this.panelContainer = panelContainer;
	};

	PanelManager.prototype.showPanel = function(panelName) {
		if (!this.loadedPanels[panelName]) {
			loadPanel.call(this, panelName);
		} else {
			show.call(this, panelName);
		}
	};

	PanelManager.prototype.closePanel = function(panelName) {
		if (!this.loadedPanels[panelName]) {
			return;
		}

		this.loadedPanels[panelName].onClose();
		delete this.loadedPanels[panelName];
		delete this.panelElements[panelName];
	};

	function loadPanel(panelName) {
		require([config.panels[panelName]], function(panel) {
			this.loadedPanels[panelName] = new panel(this);
			show.call(this, panelName);
		}.bind(this));
	};

	function show(panel) {
		Object.keys(this.loadedPanels).forEach(function(key) {
			if (key !== panel) {
				this.loadedPanels[key].onHide();
			}
		}, this);
		
		if (!this.panelElements[panel]) {
			var panelElement = this.loadedPanels[panel].getElement();
			this.panelElements[panel] = panelElement;
		}

		React.render(createPanelComponent(this.panelElements[panel]), this.panelContainer);
		this.loadedPanels[panel].onShow();
	};

	function createPanelComponent(elements) {
		var panelComponent = React.createClass({
			getInitialState: function() {
				return {isHidden: false};
			},
			render: function() {
				return React.createElement("div", {className: "panel"}, elements);
			}
		});
		return React.createElement(panelComponent);	
	};

	return PanelManager;
});