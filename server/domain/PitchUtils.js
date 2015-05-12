"use strict"

var config = require("./Config");

var utils = {
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