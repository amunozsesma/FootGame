define(["react"], function (React) {
	"use strict";

	var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	var CardComponent = React.createClass({
		getInitialState: function() {
			return {
				cardCount: 70,
				revealedCards: [{name: "Sprint"}, {name: "OneTwo"}, {name: "Fall Back"}, {name: "polms"}],
				actionedCards: []
			};
		},

		onRevealedCardCliecked: function(revealedCardIndex) {
			var revealedCards = this.state.revealedCards.splice(0);
			var actionedCards = this.state.actionedCards.concat(revealedCards.splice(revealedCardIndex, 1));

			this.setState({
				revealedCards: revealedCards,
				actionedCards: actionedCards
			});
		},

		render: function() {
			return (
				<div>
					<DeckComponent cardCount={this.state.cardCount} />
					<RevealedCards cards={this.state.revealedCards} clickAction={this.onRevealedCardCliecked} />
					<ActionedCards cards={this.state.actionedCards} />
				</div>
			);
		}
	});

	var DeckComponent = React.createClass({
		render: function() {
			var deckCards = [];
			for (var i = 0; i < this.props.cardCount; i++) {
				var style = {top: i / 5  + 'px', left: i * 3 + 'px'};
				deckCards.push(<div className="deck-card" style={style}>{i + 1}</div>);
			}

			return (
				<div className="deck-section">
					{deckCards.map(function (card) {
						return card;
					})}
				</div>
			);
		}
	});

	var RevealedCards = React.createClass({
		onClick: function(index) {
			this.props.clickAction(index);
		},

		render: function() {
			return (
				<div className="revealed-cards-section">
					<ReactCSSTransitionGroup transitionName="revealed-card">
						{this.props.cards.map(function(card, index) {
							var clickHandler = this.onClick.bind(this, index);
							return <div key={card.name} className="card" onClick={clickHandler}>{card.name}</div>	
						}, this)}
					</ReactCSSTransitionGroup>
				</div>
			);
		}
	});

	var ActionedCards = React.createClass({
		render: function() {
			return (
				<div className="actioned-cards-section">
					<ReactCSSTransitionGroup transitionName="actioned-card">
						{this.props.cards.map(function(card, index) {
							return <div key={card.name} className="card">{card.name}</div>
						})}
					</ReactCSSTransitionGroup>
				</div>

			);
		}
	});

	return CardComponent;
});