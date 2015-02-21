require(["config", "panel/PanelManager"], function(config, PanelManager) {
	var panelManager = new PanelManager(document.getElementById("game-area"));
	panelManager.showPanel(config.initialPanel);
});
