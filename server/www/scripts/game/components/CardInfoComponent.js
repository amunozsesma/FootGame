define(["react", "utils/Utils", "game/UserAreaController"], function (React, Utils, Controller) {
	"use strict";

	var CardInfoComponent = React.createClass({
		getInitialState: function() {
			return {
				cardsPlayed: []
			};
		},

		setInitialState: function() {
			this.setState({
				cardsPlayed: []	
			});
		},

		setCardPlayed: function(data) {
			this.setState({
				cardsPlayed: data.state.getCardsPlayedByPlayers()	
			});	
		},

		componentWillMount: function() {
			Controller.on("load-state",		this.setInitialState);
			Controller.on("card-actioned",	this.setCardPlayed	);
		},

		render: function() {
			var cardsPlayed = this.state.cardsPlayed.map(function(cardPlayed) {
				return (
					<div className="card-playerd-container skeleton">{cardPlayed.playerName + " - " + cardPlayed.cardName}</div>
				);
			});

			return (
				<div>
					{cardsPlayed}
				</div>
			);
		}
	});

	return <CardInfoComponent />;
});
