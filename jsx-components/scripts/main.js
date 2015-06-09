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

	var app = new App(pitchContainer);
	app.start();
});
