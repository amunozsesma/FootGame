define(["config"], function(config) {
	function PanelManager(panelContainer) {
		this.loadedPanels = {};
		this.panelComponents = {};
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
		delete this.panelComponents[panelName];
	};

	function loadPanel(panelName) {
		require([config.panels[panelName]], function(panel) {
			this.loadedPanels[panelName] = new panel(this);
			show.call(this, panelName);
		}.bind(this));
	};

	function show(panel) {
		Object.keys(this.panelComponents).forEach(function(key) {
			if (key !== panel) {
				this.panelComponents[key].setState({isHidden: true});
				this.loadedPanels[key].onHide();
			}
		}, this);
		
		if (!this.panelComponents[panel]) {
			var panelComponent = createPanelComponent(this.loadedPanels[panel].getElement());
			this.panelComponents[panel] = React.render(panelComponent, this.panelContainer);
			this.loadedPanels[panel].onOpen();
		}

		this.panelComponents[panel].setState({isHidden: false});
		this.loadedPanels[panel].onShow();
	};

	function createPanelComponent(elements) {
		var panelComponent = React.createClass({
			getInitialState: function() {
				return {isHidden: false};
			},
			render: function() {
				return React.createElement("div", {className: "panel", hide: this.state.isHidden}, elements);
			}
		});
		return React.createElement(panelComponent);	
	};

	return PanelManager;
});