define(function() {
	conf = {
		panels: {
			"game": "game/GamePanel",
			"teamSelection": "management/TeamSelectionPanel"
		},
		initialPanel: "teamSelection",
		mocks: true,
		mockMessage: {
			"config": {
				"players":3,
				"rows":5,
				"columns": 10,
				"user":"alvarito",
				"userTeam": "A.D. Twerkin",
				"rivalTeam": "Culo Gordo F.C.",
				"teams": {
					"A.D. Twerkin": {
						"TwerkinPlayer1": {
							"stats": {"ATTACK": 2, "DEFENCE": 3, "PASS": 3, "STRENGTH": 5},
							"img":"images/twerking1.jpg"
						},
						"TwerkinPlayer2": {
							"stats": {"ATTACK": 4, "DEFENCE": 1, "PASS": 5, "STRENGTH": 2}, 
							"img":"images/twerking2.jpg"
						},
						"TwerkinPlayer3": {
							"stats": {"ATTACK": 7, "DEFENCE": 1, "PASS": 9, "STRENGTH": 7}, 
							"img":"images/twerking3.jpg"
						}
					},
					"Culo Gordo F.C.": {
						"CuloGordoPlayer1": {
							"stats": {"ATTACK": 3, "DEFENCE": 3, "PASS": 2, "STRENGTH": 8},
							"img":"images/culogordo1.jpg"
						},
						"CuloGordoPlayer2": {
							"stats": {"ATTACK": 2, "DEFENCE": 8, "PASS": 3, "STRENGTH": 4},
							"img":"images/culogordo2.jpg"
						},
						"CuloGordoPlayer3": {
							"stats": {"ATTACK": 7, "DEFENCE": 7, "PASS": 5, "STRENGTH": 9},
							"img":"images/culogordo3.jpg"
						}
					}
				},
				"actions": {
					"attacking": ["Move", "Pass", "Shoot", "Card"],
					"defending": ["Move", "Press", "Card"]
				},
				"overallTimeout":30000
			},
			"state": {
				"players": {
					"TwerkinPlayer1": {"x":3, "y":0, "action":""},
					"TwerkinPlayer2": {"x":3, "y":2, "action":""},
					"TwerkinPlayer3": {"x":3, "y":4, "action":""},
					"CuloGordoPlayer1": {"x":4, "y":0, "action":""},
					"CuloGordoPlayer2": {"x":4, "y":2, "action":""},
					"CuloGordoPlayer3": {"x":4, "y":4, "action":""}
				},
				"side":"attacking",
				"ball": {"x":3,"y":2},
				"scores": {
					"A.D. Twerkin": 0,
					"Culo Gordo F.C.": 1
				}
			}
		}
	};

	return conf;
});