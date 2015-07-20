require.config({
	baseUrl: "scripts",

	paths: {
		"react": "libs/react",
		"text": "libs/text",
		"JSXTransformer": "libs/JSXTransformer",
		"jsx": "libs/jsx"
	}

});

require(["config", "panel/PanelManager", "services/ConnectionService", "panel/PanelOverlayController"], function(config, PanelManager, ConnectionService, PanelOverlay) {
	var panelManager = new PanelManager(document.getElementById("panel-container"));
	PanelOverlay.show("Connecting to server...");

	ConnectionService.connect(function() {
		PanelOverlay.hide();
		panelManager.showPanel(config.initialPanel);
	});

	window.onbeforeunload = function() {
		ConnectionService.send("disconnect");
	};
});
