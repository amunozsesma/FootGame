define(["react", "utils/Utils", "game/UserAreaController"], function (React, Utils, Controller) {
	"use strict";

	var ActionsComponent = React.createClass({
		getInitialState: function() {
			return {
				playerName: "",
				actions: [],
				selectedAction: "",
				card: null,
				isHidden: true
			};
		},

		setActionsHidden: function(data) {
			this.setState({
				isHidden: true
			});
		},

		setActionsShown: function(data) {
			this.setState({
				isHidden: false, 
				playerName: data.state.getSelectedPlayer(), 
				actions: data.state.getPlayerActions(), 
				selectedAction: data.state.getSelectedAction(),
				card: data.state.getCard()
			});
		},

		setPlayerActions: function(data) {
			this.setState({
				actions: data.state.getPlayerActions()
			});
		},

		setCardActioned: function(data) {
			this.setState({
				card: data.state.getCard()
			});
		},

		componentWillMount: function() {
			Controller.on("load-state",			 this.setActionsHidden );
			Controller.on("player-selected",	 this.setActionsShown  );
			Controller.on("card-actioned",	 	 this.setCardActioned  );
			Controller.on("player-unselected",	 this.setActionsHidden );
			Controller.on("posibility-selected", this.setPlayerActions );
			Controller.on("turn-end",			 this.setActionsHidden );
		},

		onButtonClicked: function(actionName) {
			var selectedAction = "";
			if (actionName === this.state.selectedAction) {
				Controller.actionUnselected();
			} else {
				Controller.actionSelected(actionName);
				selectedAction = actionName;
			}

			this.setState({selectedAction: selectedAction});
		},

		render: function() {
			var className = Utils.reactClassAppender({
				"isHidden": this.state.isHidden
			}, "actions skeleton");

			return (
				<div className={className}>
					<Description name={this.state.playerName}/>
					<Card card={this.state.card}/>
					<Buttons actions={this.state.actions} selected={this.state.selectedAction} clickHandler={this.onButtonClicked}/>
				</div>
			);
		}
	});

	var Description = React.createClass({
		render: function() {
			return (
				<div className="description-container">
					<div className="name">{this.props.name}</div>
					<div className="skeleton photo-container"></div>
				</div>
			);
		}
	});

	var Card = React.createClass({
		render: function() {
			return (
				<div className="player-card-container">
					{(this.props.card) ? <div className="card">{this.props.card.name}</div> : ""}					
				</div>
			);
		}
	});

	var Buttons = React.createClass({
		onButtonClicked: function(action) {
			this.props.clickHandler(action);
		},

		render: function() {
			var buttons = this.props.actions.map(function(action) {
				var clickHandler = this.onButtonClicked.bind(this, action);
				var className = Utils.reactClassAppender({
					"selected": this.props.selected === action,
				}, "action-button");
				return <button className={className} onClick={clickHandler}>{action}</button>
			}, this);

			return (
				<div className="buttons-container" >
					{buttons}
				</div>
			);
		}
	});

	return <ActionsComponent />;
});