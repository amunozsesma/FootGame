define(["react", "jsx!game/components/InfoComponent", "jsx!game/components/PitchComponent", "jsx!game/components/ActionsComponent"], function(React, InfoComponent, PitchComponent, ActionsComponent) {
	var App = function(infoElement, pitchElement, actionsElement) {
		this.pitchElement = pitchElement;
		this.actionsElement = actionsElement;
		this.infoElement = infoElement;
	};

	App.prototype.start = function() {
		React.render(<PitchComponent columns="11" rows="5"/>, this.pitchElement);
		React.render(<ActionsComponent />, this.actionsElement);
		React.render(<InfoComponent />, this.infoElement);
	};

	return App;

});