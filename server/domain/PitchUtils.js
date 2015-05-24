"use strict"

var config = require("./Config");

var utils = {
	DIRECTION: {
		UP: "up",
		DOWN: "down",
		RIGHT: "right",
		LEFT: "left",
		NONE: "none"
	},

	nextPosition: function(from , to, distance) {
		var positions = this.getAdjacentPositions(from.x, from.y, distance);
		var positionDistances = getDistancesArray(positions, to.x, to.y);
		var minDistance = 99999;
		var positionIndex = null;

		for (var i = 0, len = positionDistances.length; i < len; i++) {
			if (positionDistances[i] < minDistance) {
				minDistance = positionDistances[i];
				positionIndex = i;
			}
		}

		return JSON.parse(positions[positionIndex]);
	},

	getAdjacentPositions: function(x, y, distance) {
		var positions = [];
		var position = null;

		for (var extraX = -distance; (extraX <= distance) && ((x + extraX) < config.numColumns); extraX++) {
			insertPositionIfDoesNotExist(positions, x + extraX, y);
		}
			
		for (var extraY = -distance; (extraY <= distance) && ((y + extraY) < config.numRows); extraY++) {
			insertPositionIfDoesNotExist(positions, x, y + extraY);
		}	

		return positions;
	},

	getNextPositionOnDirection: function(position, direction) {
		var nextPosition = {};

		switch(direction) {
			case this.DIRECTION.RIGHT:
				nextPosition = (position.x + 1 < config.numColumns) ? {"x": position.x + 1, "y": position.y} : this.getNextPositionOnDirection({"x": position.x, "y": position.y}, this.DIRECTION.LEFT);
				break;
			case this.DIRECTION.LEFT: 
				nextPosition = (position.x - 1 >= 0) ? {"x": position.x - 1, "y": position.y} : this.getNextPositionOnDirection({"x": position.x, "y": position.y}, this.DIRECTION.RIGHT);
				break;
			case this.DIRECTION.UP: 
				nextPosition = (position.y - 1 >= 0) ? {"x": position.x, "y": position.y - 1} : this.getNextPositionOnDirection({"x": position.x, "y": position.y}, this.DIRECTION.DOWN);
				break;
			case this.DIRECTION.DOWN: 
				nextPosition = (position.y + 1 < config.numRows) ? {"x": position.x, "y": position.y + 1} : this.getNextPositionOnDirection({"x": position.x, "y": position.y}, this.DIRECTION.UP);
				break;
			default: 
				nextPosition = {"x": position.x, "y": position.y};
				break;
		}

		return nextPosition;
	},

	getDirection: function(initialPosition, movedPosition) {
		var gradX = movedPosition.x - initialPosition.x;
		var gradY = movedPosition.y - initialPosition.y;
		var direction = this.DIRECTION.NONE;

		if (gradX !== 0) {
			direction = (gradX < 0) ? this.DIRECTION.LEFT : this.DIRECTION.RIGHT;
		} else if (gradY !== 0){
			direction = (gradY < 0) ? this.DIRECTION.DOWN : this.DIRECTION.UP;
		}

		return direction;
	},

	//min, max inclusive
	getRandomNumber: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

};

function insertPositionIfDoesNotExist(positions, x, y) {
	var position = JSON.stringify({"x": x, "y": y});
	if (positions.indexOf(position) === -1) {
		positions.push(position);
	}
};

function getDistancesArray(positions, x, y) {
	var distances = [];

	positions.forEach(function(position) {
		var position = JSON.parse(position);
		var distance = Math.sqrt(Math.pow(position.x - x, 2) + Math.pow(position.y - y, 2));
		distances.push(distance);
	});

	return distances;
};

module.exports = utils;