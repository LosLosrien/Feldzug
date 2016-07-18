FeldzugApp.Drawing  = function() {
	"use strict";

	//declarations
	var
	//options
		squareSize = 128,
	//constants
		htmlLineBreak = "<br/>",
		htmlSpace = "&nbsp;",
		htmlTableStart = "<table style='width:100%; border-spacing:0'><tr><td>",
		htmlNextHorizontalCell = "</td><td>",
		htmlNextVerticalCell = "</td></tr><tr><td>",
		htmlTableEnd = "</td></tr></table>",

	initCanvas = function() {

		function canvasFullWindow() {
			//get canvas
			var canvas = FeldzugApp.Main.getCanvas();
			
			//set full window
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		canvasFullWindow();
		window.addEventListener('resize', canvasFullWindow);
	},

	drawLevelInitial = function(theTiles) {
		//declarations
		var i = 0,
			tile = {},
			image = {},
			tileXPos = 0,
			tileYPos = 0,
			tileCornerRad = squareSize/8;

		//prepare
		FeldzugApp.Controls.moveStage(10, 50);

		//function factories to preserve vars
		function createImageLoadHandler(tileSize, tileRad, image, tile) {
			return function (e) {
				tile.graphics.beginBitmapFill(image).drawRoundRect(0, 0, tileSize, tileSize, tileRad);
			};
		}
		function createHoverHandler(id) {
			return function (e) {
				displayTileInfo(id);
			};
		}

		//draw theTiles
		for (i = 0; i < theTiles.length; i += 1) {
			tileXPos = (squareSize + 1) * theTiles[i].getXPos();
			tileYPos = (squareSize + 1) * theTiles[i].getYPos();

			tile = new createjs.Shape();
			
			tile.addEventListener("mouseover", createHoverHandler(theTiles[i].getID()));
			tile.x = tileXPos;
			tile.y = tileYPos;

			image = new Image(squareSize, squareSize);
			image.onload = createImageLoadHandler(squareSize, tileCornerRad, image, tile);
			image.src = "images/" + theTiles[i].getTileImageName() + ".png";

			theTiles[i].setCreateJSTile(tile);
			FeldzugApp.Main.getStage().addChild(tile);
		}
	},

	enterDeployment = function(theUnits) {
		//declarations
		var deploymentSelectionBox = {},
			aUnitBox = {},
			aUnitImage = {},
			i = 0;

		document.getElementById("modeTitle").innerHTML = "Deployment";

		//create deploymentSelectionBox
		deploymentSelectionBox = document.createElement("div");
		deploymentSelectionBox.className = "hud";
		deploymentSelectionBox.id = "deploymentSelectionBox";
		document.body.appendChild(deploymentSelectionBox);

		//add units
		for (; i < theUnits.length; i += 1) {
			aUnitBox = document.createElement("div");
			aUnitBox.className = "unitSelectionBox";
			aUnitImage = document.createElement("img");
			aUnitImage.setAttribute("src", "images/" + theUnits[i].getUnitImageName()+ ".png");
			aUnitBox.appendChild(aUnitImage);
			aUnitBox.setAttribute("onmouseover", "FeldzugApp.Drawing.displayUnitInfo(" + theUnits[i].getID() + ")");
			deploymentSelectionBox.appendChild(aUnitBox);
		}
	},
	
	buildInfoTable = function(rows) {
		//declarations
		var i = 0,
		y = 0,
		trElement = {},
		tdElement = {},
		res = document.createElement("table");
		
		//prep table
		res.setAttribute("style", "width:100%; border-spacing:0");
		
		//build table out of two-dimensional rows
		for (; i < rows.length; i += 1) {
			//create row
			trElement = document.createElement("tr");
			
			for (y = 0; y < rows[i].length; y += 1) {
				//create, fill, append cell
				tdElement = document.createElement("td");
				tdElement.setAttribute("style","vertical-align: top;");
				tdElement.innerHTML = rows[i][y];
				trElement.appendChild(tdElement);
			}
			
			//append row
			res.appendChild(trElement);
		}
		
		return res;
	},
	
	displayUnitInfo = function(id) {
		//declarations 
		var theUnit = {},
		infoRows = [];
		
		//find data
		theUnit = FeldzugApp.GameController.Data.getUnitByID(id);
		
		//build infotext
		infoRows.push(["Type", theUnit.getLongTypeName()]);
		infoRows.push(["Level", theUnit.getLevel()]);
		infoRows.push(["Health", theUnit.getHP() + htmlSpace + "HP of" + htmlSpace + theUnit.getMaxHP() + "HP"]);
		infoRows.push(["Movement", theUnit.getMovementType() + htmlSpace + "at" + htmlSpace + theUnit.getMovementSpeed() + htmlSpace + "TpT"]);
		
		//display data
		updateInfo("Unit No. " + id, buildInfoTable(infoRows));
	},
	
	displayTileInfo = function(id) {
		//declarations 
		var i = 0,
		movementRawObject = {},
		movementInfo = "",
		theTile = {},
		infoRows = [];
		
		//find data
		theTile = FeldzugApp.GameController.Data.getTileByID(id);
		
		//build infotext
		infoRows.push(["Type", theTile.getLongTypeName()]);
		infoRows.push(["Position", "X: " + theTile.getXPos() + ", Y: " + theTile.getYPos() + ", Z: " + theTile.getZPos()]);
		infoRows.push(["Visibility Cost", theTile.getVisibilityCost()]);
		//Movement
		movementRawObject = theTile.getMovementCostRawArray();
		Object.keys(movementRawObject).forEach(function(key) { //requires ES5
			movementInfo = movementInfo + key + ": " + movementRawObject[key] + htmlLineBreak;
		});
		infoRows.push(["Movement Cost", movementInfo]);
		
		//display data
		updateInfo("Tile No. " + id, buildInfoTable(infoRows));
	},
	
	updateInfo = function(title, infoElement) {
		document.getElementById("infoBoxTitle").innerHTML =title;
		document.getElementById("infoBoxInfo").innerHTML = ""; //reset info
		document.getElementById("infoBoxInfo").appendChild(infoElement);
	},
	
	enterPlayerDeployment = function() {
		//declaration
		var i = 0,
		tiles = FeldzugApp.GameController.Data.getTiles(),
		brighterFilter = new createjs.ColorMatrixFilter(new createjs.ColorMatrix().adjustBrightness(30)),
		darkerFilter = new createjs.ColorMatrixFilter(new createjs.ColorMatrix().adjustBrightness(-30));
		
		//set approriate classes for all tiles
		for (; i < tiles.length; i += 1) {
			if (tiles[i].getPlayerAllowedToDeploy()) {
				tiles[i].getCreateJSTile().filters = [brighterFilter];
			} else {
				tiles[i].getCreateJSTile().filters = [darkerFilter];
			}
			tiles[i].getCreateJSTile().cache(0,0,squareSize,squareSize);
		}
	},
	
	exitPlayerDeployment = function() {
		//declaration
		var i = 0,
		tiles = FeldzugApp.GameController.Data.getTiles();
		
		//set approriate classes for all tiles
		for (; i < tiles.length; i += 1) {
			tiles[i].getCreateJSTile().filters = [];
			tiles[i].getCreateJSTile().uncache();
		}
	};

	//reveal public API
	return {
		drawLevelInitial: drawLevelInitial,
		getMapBoudY: function() {return (FeldzugApp.GameController.Data.getTiles().reduce(function(prev, curr) {
																	if (curr.getYPos() > prev.getYPos()) {
																		return curr;
																	} else {
																		return prev;
																	}}).getYPos() + 1) * (squareSize + 1 - 1);},
		getMapBoudX: function() {return (FeldzugApp.GameController.Data.getTiles().reduce(function(prev, curr) {
																	if (curr.getXPos() > prev.getXPos()) {
																		return curr;
																	} else {
																		return prev;
																	}}).getXPos() + 1) * (squareSize + 1 - 1);},
		enterDeployment: enterDeployment,
		initCanvas: initCanvas,
		updateInfo: updateInfo,
		displayUnitInfo: displayUnitInfo,
		enterPlayerDeployment: enterPlayerDeployment,
		exitPlayerDeployment: exitPlayerDeployment
	};

}();