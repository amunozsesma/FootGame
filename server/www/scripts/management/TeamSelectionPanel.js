define(["utils/ClientData", "management/components/LabeledInput"], function(ClientData, LabeledInput){
	"use strict";

	function TeamSelectionPanel (panelManager) {
		this.panelManager = panelManager;

		this.userName = null;
		this.teamName = null;
	};

	TeamSelectionPanel.prototype.getElement = function() {
		var userInputComponent = new LabeledInput();
		var teamInputComponent = new LabeledInput();

		userInputComponent.on("validation-ready", inputReady.bind(this, 'userName'));
		teamInputComponent.on("validation-ready", inputReady.bind(this, 'teamName'));

		var continueToGameContainer = React.createElement("div", {id: "continue-container"});
		var userInput  				= React.createElement(userInputComponent.getComponent(), {label: "Select User Name"});	
		var teamInput  				= React.createElement(teamInputComponent.getComponent(), {label: "Select team Name"});	
		var inputsArea 				= React.createElement("div", {id: "inputs-container"}, [userInput, teamInput]);

		return [inputsArea, continueToGameContainer];
	};

	TeamSelectionPanel.prototype.onOpen = function() {
		var continueSection = createConinueComponent.call(this);
		this.continueComponent = React.render(React.createElement(continueSection), document.getElementById("continue-container"));
	};

	TeamSelectionPanel.prototype.onClose = function() {
	};

	TeamSelectionPanel.prototype.onShow = function() {
	};

	TeamSelectionPanel.prototype.onHide = function() {
	};

	function inputReady(propertyName, value) {
		this[propertyName] = value;
		enablePlayGame.call(this, this.userName, this.teamName);
	};

	function enablePlayGame(userReady, teamReady) {
		if (!this.continueComponent) {
			return;
		}

		this.continueComponent.setState({enabled: userReady && teamReady });
	};

	function createConinueComponent() {
		var self = this;
		var continueSection = React.createClass({
			getInitialState: function() {
				return {
					enabled: false,
					panel: self
				};
			},
			handleClick: function(event) {
				if (this.state.enabled) {
					self.onContinueClicked();
				}
			},
			render: function() {
				var continueImage = React.createElement("i", {className: "continue-img fa fa-play fa-4", onClick: this.handleClick});
				var section = React.createElement("div", {className: "section" + ((this.state.enabled) ? " enabled" : "") }, continueImage);
				return section;
			}
		});

		return continueSection;
	};


	TeamSelectionPanel.prototype.onContinueClicked = function() {
		ClientData
			.set("userName", this.userName)
			.set("teamName", this.teamName);

		this.panelManager.showPanel("game");
	};

	return TeamSelectionPanel;
});