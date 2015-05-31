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
	var cardArea = document.getElementById("card-area");

	var cardApp = new App(cardArea);
	cardApp.start();
});
