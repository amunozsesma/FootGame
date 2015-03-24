require(["config", "panel/PanelManager", "utils/ConnectionService"], function(config, PanelManager, ConnectionService) {
	var panelManager = new PanelManager(document.getElementById("game-area"));
	// PanelOverlayController.showOverlay({
	// 	title: "Connecting to Server...",
	// 	loader: "spinner"
	// });

	ConnectionService.connect(function() {
		// PanelOverlayController.hideOverlay();
		panelManager.showPanel(config.initialPanel);
	});

	window.onbeforeunload = function() {
		ConnectionService.send("disconnect");
	};
});
