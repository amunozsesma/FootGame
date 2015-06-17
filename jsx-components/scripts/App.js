define(["react", "jsx!game/components/PitchComponent", "jsx!game/components/ActionsComponent"], function(React, PitchComponent, ActionsComponent) {
	var App = function(pitchElement, actionsElement) {
		this.pitchElement = pitchElement;
		this.actionsElement = actionsElement;
	};

	App.prototype.start = function() {
		React.render(<PitchComponent columns="11" rows="5"/>, this.pitchElement);
		React.render(<ActionsComponent />, this.actionsElement);
	};

	return App;

});