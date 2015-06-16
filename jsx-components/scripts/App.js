define(["react", "jsx!game/components/PitchComponent"], function(React, PitchComponent) {
	var App = function(element) {
		this.container = element;
	};

	App.prototype.start = function() {
		React.render(<PitchComponent columns="11" rows="5"/>, this.container);
	};

	return App;

});