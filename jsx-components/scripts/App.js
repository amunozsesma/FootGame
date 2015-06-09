define(["react"], function(React) {
	var App = function(element) {
		this.container = element;
	};

	App.prototype.start = function() {
		// React.render(<CardsComponent />, this.container);
	};

	return App;

});