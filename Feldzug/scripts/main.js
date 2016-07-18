//TODO: create fog of war and information obscurity
//TODO: do proper logging of some kind

FeldzugApp.Main = function() {
	"use strict";

	//declarations
	var	stage = {},
		canvas = {},

	//init app
	init = function() {
		//init
		canvas = document.getElementById("mainCanvas");
		stage = new createjs.Stage("mainCanvas");
		
		stage.enableMouseOver(25);
		
		FeldzugApp.Drawing.initCanvas();

		createjs.Ticker.addEventListener('tick', ticker);
		createjs.Ticker.framerate = 60;

		//example

		//prep
		FeldzugApp.Controls.loadControls();
		//go
		FeldzugApp.GameController.Logic.loadMissionByID(0);
	},

	ticker = function() {
		stage.update();
	};

	//reveal public API
	return {
		init: init,
		getStage: function() {return stage;},
		getCanvas: function() {return canvas;}
	};

}();