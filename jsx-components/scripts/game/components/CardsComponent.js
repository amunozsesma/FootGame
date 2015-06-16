define(["react", "CardController"], function (React, CardController) {
	"use strict";

	var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

	var CardComponent = React.createClass({
		getInitialState: function() {
			return {
				cardCount: 0,
				revealedCards: [],
				actionedCards: []
			};
		},

		componentWillMount: function() {
			CardController.on("new-turn", function(cards) {
				this.onNewTurn(cards);
			}, this);
			this.onNewTurn([]);
		},

		onNewTurn: function(cards) {
			var cardCount = CardController.getNumberCards();
			this.setState({
				cardCount: cardCount,
				revealedCards: cards,
				actionedCards: []
			});
		},

		onRevealedCardClicked: function(revealedCardIndex) {
			var revealedCards = this.state.revealedCards.slice();
			var actionedCards = this.state.actionedCards.slice();

			actionedCards = actionedCards.concat(revealedCards.splice(revealedCardIndex, 1));

			this.setState({
				revealedCards: revealedCards,
				actionedCards: actionedCards
			});
		},

		onActionedCardClosed: function(actionedCardIndex) {
			var actionedCards = this.state.actionedCards.slice();
			var revealedCards = this.state.revealedCards.slice();

			revealedCards = revealedCards.concat(actionedCards.splice(actionedCardIndex, 1));

			this.setState({
				revealedCards: revealedCards,
				actionedCards: actionedCards
			});
		},

		render: function() {
			return (
				<div>
					<DeckComponent cardCount={this.state.cardCount} />
					<RevealedCards cards={this.state.revealedCards} clickAction={this.onRevealedCardClicked} />
					<ActionedCards cards={this.state.actionedCards} closeAction={this.onActionedCardClosed} />
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
					{
						deckCards.map(function (card) {
							return card;
						})
					}
				</div>
			);
		}
	});

	var RevealedCards = React.createClass({
		getInitialState: function() {
			return {
				zoomedCardData: null
			}
		},

		onClick: function(index) {
			this.onMouseLeave();
			this.props.clickAction(index);
		},

		onMouseOver: function(card) {
			var element = this.refs[card.name].getDOMNode();
			
			this.setState({
				zoomedCardData: card
			});
		},

		onMouseLeave: function(e) {
			if (e && e.relatedTarget.className && e.relatedTarget.className.indexOf("zoomed") !== -1) {
				return;
			}

			this.setState({
				zoomedCardData: null
			});
		},

		render: function() {
			return (
				<div className="revealed-cards-section">
					<ReactCSSTransitionGroup transitionName="card">
						{this.props.cards.map(function(card, index) {
							var clickHandler = this.onClick.bind(this, index);
							var mouseOverHandler = this.onMouseOver.bind(this, card);
							return <div key={"revealed_" + card.name} ref={card.name} className="card" onClick={clickHandler} onMouseOver={mouseOverHandler} onMouseLeave={this.onMouseLeave}>{card.name}</div>	
						}, this)}
					</ReactCSSTransitionGroup>
					{this.state.zoomedCardData && <ZoomedCard data={this.state.zoomedCardData} position={this.state.zoomedCardPosition} onMouseLeave={this.onMouseLeave}></ZoomedCard>}
				</div>
			);
		}
	});

	var ActionedCards = React.createClass({
		onCardClosed: function(index) {
			this.props.closeAction(index);
		},

		render: function() {
			return (
				<div className="actioned-cards-section">
					<ReactCSSTransitionGroup transitionName="card">
						{this.props.cards.map(function(card, index) {
							var onClosedCardHandler = this.onCardClosed.bind(this, index);
							return (
								<div key={"actioned_" + card.name} className="card">
									<span>{card.name}</span>
									<div className="close fa fa-times" onClick={onClosedCardHandler}></div>
								</div>
								);
						}, this)}
					</ReactCSSTransitionGroup>
				</div>

			);
		}
	});

	var ZoomedCard = React.createClass({
		render: function() {
			return (
				<div className="card zoomed" onMouseLeave={this.props.onMouseLeave}>{this.props.data.name}</div>
			);
		}
	});

	return CardComponent;
});