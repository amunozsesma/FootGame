define(["react", "game/CardController", "utils/Utils"], function (React, CardController, Utils) {
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
			CardController.on("cards-changed", function(state) {this.setState(state)}.bind(this));
		},
 
		render: function() {
			return (
				<div>
					<DeckComponent cardCount={this.state.cardCount} />
					<RevealedCards cards={this.state.revealedCards} />
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
				zoomedCardData: null
			}
		},

		onClick: function(index) {
			this.onMouseLeave();
			CardController.revealedCardClicked(index);
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
							return (
								<div key={"revealed_" + card.name} ref={card.name} className="card" onClick={clickHandler} onMouseOver={mouseOverHandler} onMouseLeave={this.onMouseLeave}>
									<div className="title">{card.name}</div>
								</div>
							);	
						}, this)}
					</ReactCSSTransitionGroup>
					{this.state.zoomedCardData && <ZoomedCard data={this.state.zoomedCardData} position={this.state.zoomedCardPosition} onMouseLeave={this.onMouseLeave}></ZoomedCard>}
				</div>
			);
		}
	});

	var ActionedCards = React.createClass({
		onCardClosed: function(index, e) {
			e.stopPropagation();
			CardController.actionedCardClosed(index);
		},

		onCardClicked: function(index) {
			CardController.actionedCardClicked(index);
		},

		render: function() {
			return (
				<div className="actioned-cards-section">
					<ReactCSSTransitionGroup transitionName="card">
						{this.props.cards.map(function(card, index) {
							var onClosedCardHandler = this.onCardClosed.bind(this, index);
							var onClickedCardHandler = this.onCardClicked.bind(this, index);
							var className = Utils.reactClassAppender({
								"disabled": card.actionsLeft === 0
							}, "card");

							return (
								<div key={"actioned_" + card.name} onClick={onClickedCardHandler} className={className}>
									<span>{card.name}</span>
									<div className="actions-left">{card.actionsLeft}</div>
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
				<div className="card zoomed" onMouseLeave={this.props.onMouseLeave}>
					<div className="title">{this.props.data.name}</div>
					<div className="description">{this.props.data.description}</div>
				</div>
			);
		}
	});

	return <CardComponent />;
});