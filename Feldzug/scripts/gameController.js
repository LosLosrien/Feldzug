FeldzugApp.GameController = {};

//enums
FeldzugApp.GameController.MODES = {
	DEPLOY: "Deployment"
};

FeldzugApp.GameController.OPTIONS = {
	NODEPLOY: "noDeploymentPhase"
};

FeldzugApp.GameController.Logic = function() {
	"use strict";

	//declarations
	var

	loadMissionByID = function(missionID) {
		//load
		FeldzugApp.GameController.Data.setMission(FeldzugApp.Data.getMissions().getObjectByID(missionID));
		FeldzugApp.Drawing.drawLevelInitial(FeldzugApp.GameController.Data.getTiles());

		if (!FeldzugApp.GameController.Data.getOption(FeldzugApp.GameController.OPTIONS.NODEPLOY)) {
			FeldzugApp.Drawing.enterDeployment(FeldzugApp.GameController.Data.getPlayerUnits());
		} else {
			//TODO: if no-deploy mission do something else
		}
		
		//this was just a test and it worked
		//FeldzugApp.Pathfinder.resolveFromTo(FeldzugApp.GameController.Data.getTileAt(0,0), FeldzugApp.GameController.Data.getTileAt(1,1), FeldzugApp.GameController.Data.getPlayerUnits()[0]);
	};

	//reveal public API
	return {
		loadMissionByID: loadMissionByID
	};

}();

FeldzugApp.GameController.Data = function() {
	"use strict";

	//declarations
	var
		mode = "",
		mission,
		tiles = [],
		playerUnits = [],
		opponentUnits = [],
	
	setMission = function(theMission) {
		//declarations
		var i = 0,
		map = {},
		simpleArray = [];
		
		//prep
		mission = theMission;
		map = FeldzugApp.Data.getMaps().getObjectByID(mission.mapID);
		
		//build tiles
		for (i = 0; i < map.tiles.length; i+=1) { 
			simpleArray.push(new Tile(map.tiles[i].tileTypeID, i, map.tiles[i].position.x, map.tiles[i].position.y, map.tiles[i].position.x, map.tiles[i].playerAllowedToDeploy));
			simpleArray[i].id = i;
		}
		tiles = new DataArray(simpleArray);
		
		//build units
		simpleArray = [];
		for (i = 0; i < mission.playerUnits.length; i+=1) { 
			simpleArray.push(new Unit(mission.playerUnits[i].unitTypeID, i));
			simpleArray[i].id = i;
		}
		playerUnits = new DataArray(simpleArray);
		
		//TODO: opponent units like player units
	},
	
	getTileAt = function(x, y) {
		var resArray = $.grep(tiles, function(tile) { return tile.getXPos() === x && tile.getYPos() === y; });

		if (resArray.length === 1 && typeof resArray[0] !== "undefined") {
			return resArray[0];
		} else {
			console.log("getTileAt found not one object.");
			return null;
		}
	},
	
	getTileByID = function(id) {
		return tiles.getObjectByID(id);
	},
	
	getUnitByID = function(id){
		var res = playerUnits.getObjectByID(id);
		
		//TODO: activate after opponentUnits has been implemented
		//if (res === null) {
		//	res = opponentUnits.getObjectByID(id);
		//}
		
		return res;
	};

	//reveal public API
	return {
		setMission: setMission,
		getTiles: function() {return tiles;},
		getPlayerUnits : function() {return playerUnits;},
		getTileAt: getTileAt,
		getTileByID: getTileByID,
		getUnitByID: getUnitByID,
		getOption: function(theOption) {return mission.options[theOption];}
	};

}();