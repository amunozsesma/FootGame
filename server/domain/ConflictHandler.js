module.exports = function() {
	"use strict";

	var Utils = require("./PitchUtils");
	var Config = require("./Config");

	var ConlictHandler = function(userHelper) {
		this.userHelper = userHelper;
		this.compareStrategy = Config.compareStrategy;
		this.resolveStrategy = Config.resolveStrategy;
	};

	// CONFLICT COMPARATOR METHODS - return null or position
	ConlictHandler.SAME_CELL_COMPARISON = "same-cell";
	var conflictComparatorMapper = {
		"same-cell": sameCellComparator
	};
	
	function sameCellComparator(playerPosition, rivalPosition) {
		return (playerPosition.x === rivalPosition.x && playerPosition.y === rivalPosition.y) ? playerPosition : null;
	};

	///////////////////////////////////////////

	// CONFLICT RESOLUTION METHODS - returns an array of {name:, position: {x: , y:}} with the positions of each of the players of the conflict
	ConlictHandler.DEFENDER_WINS = "defender-wins";
	var conflictResolutionMapper = {
		"defender-wins": defenderWinsResolver
	};

	function defenderWinsResolver(conflict){
		var resolved = [];
		var player = conflict.players[0];
		var rivalPlayer = conflict.players[1];
		var sides = {};
		var winningPlayer = null, loossingPlayer = null;

		if (this.userHelper.getPlayerSide(player.name) === this.userHelper.getPlayerSide(rivalPlayer.name)) {
			var index = Utils.getRandomNumber(0, 1);
			winningPlayer = conflict.players[index];
			loossingPlayer = conflict.players[Math.abs(index-1)];
		} else {
			sides[this.userHelper.getPlayerSide(player.name)] = player;
			sides[this.userHelper.getPlayerSide(rivalPlayer.name)] = rivalPlayer;
			winningPlayer = sides["defending"];
			loossingPlayer = sides["attacking"];
		}

		// console.log("RESOLVING CONFLICT IN [" + conflict.position.x + ", " + conflict.position.y + "] WIth - Winner: " + winningPlayer.name + " | Looser: " + loossingPlayer.name);

		return generateResolvedPlayers(winningPlayer, loossingPlayer, conflict);
	};

	function generateResolvedPlayers(winner, looser, conflict) {
		var resolved = [];

		resolved.push({name: winner.name, position: conflict.position});
		if (looser.movedPosition && (JSON.stringify(looser.movedPosition) !== JSON.stringify(looser.initialPosition))) {
			console.log("looser player was NOT static");
			resolved.push({name: looser.name, position: looser.initialPosition});				
		} else {
			console.log("looser player WAS static");
			var winningPlayerDirection = Utils.getDirection(winner.initialPosition, winner.movedPosition);
			var looserResolvedPosition = Utils.getNextPositionOnDirection(looser.initialPosition, winningPlayerDirection);
			resolved.push({name: looser.name, position: looserResolvedPosition});
		}

		return resolved;
	};

	///////////////////////////////////////////

	ConlictHandler.prototype.getResolvedPositions = function(initialPositions, movedPositions) {
		var resolvedPositions = {};
		var conflicts = generateConflicts.call(this, initialPositions, movedPositions);
		var resolvedConflicts = resolveConflicts.call(this, conflicts);

		return mergeResolvedConflicts(movedPositions, resolvedConflicts);
	};

	function generateConflicts(initialPositions, movedPositions) {
		var conflicts = [];
		var conflictPositions = [];
		var teams = this.userHelper.getTeams();
		var players = this.userHelper.getPlayers(teams[0]);
		var rivalPlayers = this.userHelper.getPlayers(teams[1]);

		players.forEach(function(playerName) {
			var playerPosition = getPositionFromMovedOrInitial(playerName, initialPositions, movedPositions);
			rivalPlayers.forEach(function(rivalPlayerName) {
				var rivalPlayerPosition = getPositionFromMovedOrInitial(rivalPlayerName, initialPositions, movedPositions);

				var conflictPosition = conflictComparatorMapper[this.compareStrategy].call(this, playerPosition, rivalPlayerPosition);
				if (conflictPosition) {
					var playerNames = [playerName, rivalPlayerName];
					conflictPositions.push(JSON.stringify(conflictPosition));
					conflicts.push(generateConflict.call(this, conflictPosition, playerNames, initialPositions, movedPositions));
				};
			}, this);

		}, this);

		return conflicts;
	};

	function resolveConflicts(conflicts) {
		var resolvedConflicts = [];

		conflicts.forEach(function (conflict) {
			var resolvedPlayers = conflictResolutionMapper[this.resolveStrategy].call(this, conflict);
			resolvedConflicts = resolvedConflicts.concat(resolvedPlayers);			
		}, this);

		return resolvedConflicts;
	};

	function getPositionFromMovedOrInitial(playerName, initial, moved) {
		return (moved[playerName]) ? moved[playerName] : initial[playerName];
	};

	function generateConflict(position, playerNames, initialPositions, movedPositions) {
		var conflict = {
			"position": position,
			"players": []
		};

		playerNames.forEach(function (playerName) {
			var player = generatePlayerForConflict.call(this, playerName, initialPositions, movedPositions);
			conflict.players.push(player);
		}, this);

		return conflict;
	};

	function generatePlayerForConflict(playerName, initialPositions, movedPositions) {
		return {"name": playerName, "initialPosition": initialPositions[playerName], "movedPosition": movedPositions[playerName], "side": this.userHelper.getPlayerSide(playerName)};
	};

	function mergeResolvedConflicts(playerPositions, resolvedConflicts) {
		var mergedPlayerPositions = playerPositions;

		resolvedConflicts.forEach(function(playerResolved) {
			mergedPlayerPositions[playerResolved.name] = {};
			mergedPlayerPositions[playerResolved.name].x = playerResolved.position.x;
			mergedPlayerPositions[playerResolved.name].y = playerResolved.position.y;
		});

		return mergedPlayerPositions;
	};

	return ConlictHandler;
};