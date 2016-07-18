FeldzugApp.Controls = function() {
	"use strict";

	//declarations
	var KEYCODE_LEFT = 37,
		KEYCODE_RIGHT = 39,
		KEYCODE_UP = 38,
		KEYCODE_DOWN = 40,
	//options
		zoomFactor = 0.1,
		maxZoom = 2,
		minZoom = 0.5,
		keyMoveOffset = 10,
		maxMapMove = 500,


	loadControls = function() {
		//declarations
		var mouseWheelEventName = "mousewheel";

		//zoom
		if (/Firefox/i.test(navigator.userAgent)) {
			mouseWheelEventName = "DOMMouseScroll"; //FF doesn't recognize mousewheel as of FF3.x
		}
		FeldzugApp.Main.getCanvas().addEventListener(mouseWheelEventName, mouseWheelZoomHandler, false); //wheel
		//TODO: implement pinch to zoom for touch-devices 

		//pan
		FeldzugApp.Main.getStage().addEventListener("stagemousedown", dragPanHandler); //mouse
		document.addEventListener("keydown", keyPressHandler); //keys
	},


	dragPanHandler = function(e) {
		//declarations
		var stage = FeldzugApp.Main.getStage(),
		offset = {x: stage.x - e.stageX, y: stage.y - e.stageY}; //offset point

		//add move listener
		stage.addEventListener("stagemousemove", function(e2) {
			moveStage(e2.stageX + offset.x, e2.stageY + offset.y);
		});

		//add "remove move listener" listener
		stage.addEventListener("stagemouseup", function(){
			stage.removeAllEventListeners("stagemousemove");
		});
	},

	mouseWheelZoomHandler = function(e) {
		//declarations
		var
			newScale = 1,
			crossBrowserDelta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))), //FF, see above
			stage = FeldzugApp.Main.getStage(), //make access easier
			localMousePos = stage.globalToLocal(stage.mouseX, stage.mouseY);

		//init
		if(crossBrowserDelta>0) {
			newScale = stage.scaleX * (1+zoomFactor);
		} else {
			newScale = stage.scaleX * (1-zoomFactor);
		}

		if (minZoom <= newScale && newScale <= maxZoom) {
			//set registration point to mouse pointer and change pos accordingly
			stage.regX = localMousePos.x;
			stage.regY = localMousePos.y;
			stage.x = stage.mouseX;
			stage.y = stage.mouseY;

			//zoom
			stage.scaleX = newScale;
			stage.scaleY = newScale;
		}
	},

	keyPressHandler = function() {
		var stage = FeldzugApp.Main.getStage(); //make access easier
		
		switch(event.keyCode) {
			case KEYCODE_LEFT:
				moveStage(stage.x + keyMoveOffset, stage.y);
				break;
			case KEYCODE_RIGHT:
				moveStage(stage.x - keyMoveOffset, stage.y);
				break;
			case KEYCODE_UP:
				moveStage(stage.x, stage.y + keyMoveOffset);
				break;
			case KEYCODE_DOWN:
				moveStage(stage.x, stage.y - keyMoveOffset);
				break;
		}
	},

	moveStage = function(newX,newY) {
		var
			stage = FeldzugApp.Main.getStage(), //make access easier
			oldX = stage.x,
			scaledRegX = stage.regX * stage.scaleX,
			scaledMapBoundX = FeldzugApp.Drawing.getMapBoudX() * stage.scaleX,
			oldY = stage.y,
			scaledRegY = stage.regY * stage.scaleY,
			scaledMapBoundY = FeldzugApp.Drawing.getMapBoudY() * stage.scaleY;

		if (((oldX < newX) && ((newX - scaledRegX) <= maxMapMove)) || //to the left and in left bound or
			((oldX > newX) && ((newX - scaledRegX - window.innerWidth) >= (-scaledMapBoundX - maxMapMove)))) { //to the right and in right bound
			stage.x = newX;
		}

		if (((oldY < newY) && ((newY - scaledRegY) <= maxMapMove)) || //up and in upper bound or
			((oldY > newY) && ((newY - scaledRegY - window.innerHeight) >= (-scaledMapBoundY - maxMapMove)))) { //down and in lower bound
			stage.y = newY;
		}
	};

	//reveal public API
	return {
		loadControls: loadControls,
		moveStage: moveStage
	};

}();

