define(["Emitter"], function(Emitter) {
	"use strict";

	var StateHandler = function() {
		this.initialState = {};
		this.modifiedState = {};
	};

	Emitter.mixInto(StateHandler);

	StateHandler.prototype.loadStaticContext = function() {
		this.trigger("load-static-state");
	};

	StateHandler.prototype.loadState = function(state, isInitial) {
		// Maybe stract to helper function -> var state = new StateHelper(state);
		this.initialState = state;
		processState.call(this);

		if (isInitial) {
			this.trigger("load-initial-state", this);
		} else {
			this.trigger("load-state", this);
		}
	};

	function processState() {
		//deep clone
		deepClone.call(this, this.initialState, this.modifiedState); 
	};

	//Extract to utility
	function deepClone(from, into) {
		for (var key in from) {
			if (typeof from[key] === "object") {
				into[key] = {};
				deepClone.call(from[key], into[key]);
			} else {
				into[key] = from[key];
			}
		}
	}	

	//Methods to get state information or to modify state
	StateHandler.prototype.getUser = function() {
		var user = this.initialState.config.user;

		if (!user) throw new Error("A ver, subnormal, el puto usuario");

		return user;
	};

	StateHandler.prototype.getDimensions = function() {
		var columns = this.initialState.config.columns;
		var rows = this.initialState.config.rows;

		if (!columns || !rows) throw new Error("Cuanto pollas mide el campo?");

		return {"columns": columns, "rows": rows};
	};

	StateHandler.prototype.getUserPlayerPositions = function() {
		var userTeam = this.initialState.config.team;
		if(!userTeam) throw new Error("El puto usuario no tiene equipo");

		var userPlayers = this.initialState.state.teams[userTeam];
		if(!userPlayers) throw new Error("Vale, " + userTeam + " no tiene jugadores, como pelotas juega?");

		return userPlayers;
	};

	StateHandler.prototype.getRivalPlayerPositions = function() {
		var rivalTeam = this.initialState.config.rival;
		if(!rivalTeam) throw new Error("Sin rival o q?");

		var rivalPlayers = this.initialState.state.teams[rivalTeam];
		if(!rivalPlayers) throw new Error("Guay el equipo rival, " + rivalTeam + " no tiene jugadores, tu eres subnormal.");

		return rivalPlayers;
	};

	return StateHandler;

});

// initialMockConfig = {
// 	"config": {
// 		"players":3,
// 		"rows":3,
// 		"columns":9,
// 		"user":"alvarito",
// 		"team": "A.D. Twerkin"
// 	},
// 	"state": {
// 		"teams": {
// 			"A.D. Twerkin": {
// 				"TwerkinPlayer1": {"x":0, "y":1},
// 				"TwerkinPlayer2": {"x":1, "y":1},
// 				"TwerkinPlayer3": {"x":0, "y":2}
// 			},
// 			"Culo Gordo F.C.": {
// 				"CuloGordoPlayer1": {"x":5, "y":0},
// 				"CuloGordoPlayer2": {"x":5, "y":1},
// 				"CuloGordoPlayer3": {"x":5, "y":2}
// 			}
// 		},
// 		"ball": {"x":3,"y":3}
// 	}
// }