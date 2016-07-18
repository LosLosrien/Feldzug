//FeldzugApp.Modell.Library.Dataloader laods staic game data from files
//TODO: do the loading like it was hosted on a server, TODO: do the loading without the disgusting async/sync hack TODO: load all files in directory

FeldzugApp = {};
FeldzugApp.Modell = {};
FeldzugApp.Modell.Library = {};

FeldzugApp.Modell.Library.Dataloader = function() {
	"use strict";

	var
		maps = {},
		missions = {},
		unitTypes = {},
		tileTypes =  {},

	getTileTypes = function() {
		if ($.isEmptyObject(tileTypes)) {
			$.ajaxSetup({async: false}); //handle ajax synchronously
			$.getJSON("data/tileTypes/baseTileTypes.json", function(data) {tileTypes =  new DataArray(data);});
			$.ajaxSetup({async: true}); //handle ajax asynchronously
		}
		return tileTypes;
	},

	getUnitTypes = function() {
		if ($.isEmptyObject(unitTypes)) {
			$.ajaxSetup({async: false}); //handle ajax synchronously
			$.getJSON("data/unitTypes/baseUnitTypes.json", function(data) {unitTypes =  new DataArray(data);});
			$.ajaxSetup({async: true}); //handle ajax asynchronously
		}
		return unitTypes;
	},

	getMissions = function() {
		if ($.isEmptyObject(missions)) {
			$.ajaxSetup({async: false}); //handle ajax synchronously
			$.getJSON("data/missions/baseMissions.json", function(data) {missions =  new DataArray(data);});
			$.ajaxSetup({async: true}); //handle ajax asynchronously
		}
		return missions;
	},

	getMaps = function() {
		if ($.isEmptyObject(maps)) {
			$.ajaxSetup({async: false}); //handle ajax synchronously
			$.getJSON("data/maps/baseMaps.json", function(data) {maps =  new DataArray(data);});
			$.ajaxSetup({async: true}); //handle ajax asynchronously
		}
		return maps;
	};

	//reveal public API
	return {
		getMaps: getMaps,
		getMissions: getMissions,
		getUnitTypes: getUnitTypes,
		getTileTypes: getTileTypes
	};
}();