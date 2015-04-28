var	State = require("./state").State;	
var Position = require ("./position").Position;
var Ball = require ("./ball").Ball;
var Stats = require ("./stats").Stats;
var Game = require ("./game").Game;
var Config = require("./config").Config;


var StateHandler = function() {
};

StateHandler.prototype.generateInitialState = function(users) {
	var config = new Config(3,5,10, 30000);
	var ball = new Ball(createRandomPosition());
	var game = new Game(users, config, ball)
	var state = new State(game);

	return state;
};

function createRandomPosition () {
	var position = new Position(getRandomNumber(0,9), getRandomNumber(0,4));
	return position;
};

function getRandomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min);
};

module.exports = StateHandler;