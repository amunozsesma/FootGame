define(["react", "game/UserAreaController", "utils/ClientData", "jsx!game/components/InfoComponent", "jsx!game/components/PitchComponent", "jsx!game/components/ActionsComponent"], function(React, Controller, ClientData, InfoComponent, PitchComponent, ActionsComponent) {
	var App = function(infoElement, pitchElement, actionsElement) {
		this.pitchElement = pitchElement;
		this.actionsElement = actionsElement;
		this.infoElement = infoElement;
	};

	App.prototype.start = function() {
		React.render(<PitchComponent columns="11" rows="5"/>, this.pitchElement);
		React.render(<ActionsComponent />, this.actionsElement);
		React.render(<InfoComponent />, this.infoElement);

		var message = 
		{"game":
			{
				"config": {"numPlayers":3,"numRows":5,"numColumns":10,"overallTimeout":30000},
				"ball": {"x":9,"y":4},
				"score":{"rr":0,"pp":0},
				"users":
				[
					{
						"id":"88wUO98mg8bV0gIFAAAB",
						"name":"e",
						"side": "attacking",
						"team":
						{
							"name":"rr",
							"players":[
								{"name":"rr_Player_0","position":{"x":6,"y":2},"stats":{"attack":10,"defense":2,"speed":2,"strength":8}},
								{"name":"rr_Player_1","position":{"x":6,"y":1},"stats":{"attack":1,"defense":9,"speed":4,"strength":7}},
								{"name":"rr_Player_2","position":{"x":9,"y":2},"stats":{"attack":5,"defense":7,"speed":8,"strength":3}}
							]
						},
						"teamName":"rr"
					},
					{
						"id":"B4YdveSrS3hk2BANAAAA",
						"name":"uu",
						"side": "defending",
						"team":
						{
							"name":"pp",
							"players":[
								{"name":"pp_Player_0","position":{"x":6,"y":3},"stats":{"attack":4,"defense":7,"speed":3,"strength":8}},
								{"name":"pp_Player_1","position":{"x":7,"y":0},"stats":{"attack":3,"defense":6,"speed":3,"strength":2}},
								{"name":"pp_Player_2","position":{"x":5,"y":1},"stats":{"attack":9,"defense":7,"speed":2,"strength":7}}
							]
						},
						"teamName":"pp"
					}
				]
			}
		};

		window.start = function() {
			ClientData.set("userId", "88wUO98mg8bV0gIFAAAB");
			Controller.setInputState(message);
		}

	};

	return App;

});