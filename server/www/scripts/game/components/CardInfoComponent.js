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

		setCards: function(data) {
			this.setState({
				cardsPlayed: data.state.getCardsPlayedByPlayers()	
			});	
		},

		componentWillMount: function() {
			Controller.on("load-state",		 this.setInitialState);
			Controller.on("card-actioned",	 this.setCards		 );
			Controller.on("card-deselected", this.setCards		 );
		},

		render: function() {
			var cardsPlayed = this.state.cardsPlayed.map(function(cardPlayed) {
				return (
					<div className="card-playerd-container skeleton" >{cardPlayed.playerName + " - " + cardPlayed.card.name}</div>
				);
			}, this);

			return (
				<div>
					{cardsPlayed}
				</div>
			);
		}
	});

	return <CardInfoComponent />;
});
