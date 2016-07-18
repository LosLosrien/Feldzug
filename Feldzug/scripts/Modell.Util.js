//FeldzugApp.Modell.Util contains generally usefull classes

FeldzugApp.Modell.Util = {};

//dataArray Type - used to access data objects in arrays
function DataArray(theArray) {
	"use strict";

	theArray.getObjectByID = function(id) {
		var resArray = $.grep(this, function(e){ return e.id === id; });
		if (resArray.length === 1 && typeof resArray[0] !== "undefined") {
			return resArray[0];
		} else {
			window.alert("getObjectpByID with ID: '" + id + "' found not one object.");
			return null;
		}
	};

	theArray.getObjectByName = function(name) {
		var resArray = $.grep(this, function(e){ return e.name === name; })[0];
		if (resArray.length === 1 && typeof resArray[0] !== "undefined") {
			return resArray[0];
		} else {
			window.alert("getObjectByName with Name: '" + name + "' found not one object.");
			return null;
		}
	};

	return theArray;
}

FeldzugApp.Modell.Util.IDUtil = (function () {
	"use strict";
  var instance = {};

	function init() {
		//private
		var lastID = 0;

		//public
		return {
			getnextID: function () {
				lastID = lastID + 1;
				return lastID;
			}
		};
	}
	
	return {
		getInstance: function () {
			if ( !instance ) {
				instance = init();
			}
			return instance;
		}
	};

})();