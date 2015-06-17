require.config({
	baseUrl: "scripts",

	paths: {
		"react": "libs/react",
		"text": "libs/text",
		"JSXTransformer": "libs/JSXTransformer",
		"jsx": "libs/jsx"
	}

});


require(["jsx!App"], function(App) {
	var pitchContainer = document.getElementById("pitch-container");
	var actionsContainer = document.getElementById("actions-container");

	var app = new App(pitchContainer, actionsContainer);
	app.start();
});
