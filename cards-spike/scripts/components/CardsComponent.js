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
		getInitialState: function() {
			return {
				isElementHovered: false,
				zoomedCardData: {},
				zoomedCardPosition: {}
			}
		},

		onClick: function(index) {
			this.props.clickAction(index);
		},

		onMouseOver: function(card) {
			var element = this.refs[card.name].getDOMNode();
			
			var position = {left: element.offsetWidth/2 + element.offsetLeft, top: element.offsetHeight/2 + element.offsetTop};
			this.setState({
				isElementHovered: true,
				zoomedCardData: card,
				zoomedCardPosition: position
			});
		},

		onMouseLeave: function(card) {
			var element = this.refs[card.name].getDOMNode();
			this.setState({
				isElementHovered: false,
				zoomedCardData: {},
				zoomedCardPosition: {}
			});
		},

		render: function() {
			return (
				<div className="revealed-cards-section">
					<ReactCSSTransitionGroup transitionName="revealed-card">
						{this.props.cards.map(function(card, index) {
							var clickHandler = this.onClick.bind(this, index);
							var mouseOverHandler = this.onMouseOver.bind(this, card);
							var mouseLeaveHandler = this.onMouseLeave.bind(this, card);
							return <div key={card.name} ref={card.name} className="card" onClick={clickHandler} onMouseOver={mouseOverHandler} onMouseLeave={mouseLeaveHandler}>{card.name}</div>	
						}, this)}
					</ReactCSSTransitionGroup>

					{this.state.isElementHovered && <ZoomedCard data={this.state.zoomedCardData} position={this.state.zoomedCardPosition}></ZoomedCard>}
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

	var ZoomedCard = React.createClass({
		render: function() {
			return (
				<div className="card zoomed" style={this.props.position}>{this.props.data.name}</div>
			);
		}
	});

	return CardComponent;
});