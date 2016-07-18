//FeldzugApp.Modell.Modell contains the game state and it's business logic (this is probably not differentiated enough yet)

//unit Type - used for units in play
function Unit(theUnitTypeID, optPartialUnitDDO) { //optPartialUnitDDO can contain everything except unitTypeID, which gets ignored
	"use strict";
	
	//declarations
	var unitTypeLDDO = {},
		unitDDO = {},
	
	//completes unitDDO
	buildUnitDDO = function() {
		//use optPartialUnitDDO
		if (typeof optPartialUnitDDO !== "undefined") {
			unitDDO = optPartialUnitDDO;
		}
		
		//inti stuff
		//id
		if (!unitDDO.hasOwnProperty('id')) {
			unitDDO.id = FeldzugApp.Modell.Util.IDUtil.getInstance().getNextID();
		}
		//level
		if (!unitDDO.hasOwnProperty('level')) {
			unitDDO.level = 1;
		}
		//movementSpeed
		if (!unitDDO.hasOwnProperty('movementSpeed')) {
			unitDDO.movementSpeed = unitTypeLDDO.baseMovementSpeed;
		}
		//hp
		if (!unitDDO.hasOwnProperty('hp')) {
			unitDDO.hp = unitTypeLDDO.baseHP;
		}
		//maxHP
		if (!unitDDO.hasOwnProperty('maxHP')) {
			unitDDO.maxHP = unitTypeLDDO.baseHP;
		}
		//fix unitTypeID
		unitDDO.unitTypeID = unitTypeLDDO.id;
	},
	
	levelUp = function() {
		//TODO: implement this
	};
	
	//constructor
	unitTypeLDDO = FeldzugApp.Modell.Library.Dataloader.getUnitTypes().getObjectByID(theUnitTypeID);
	buildUnitDDO();

	//reveal public API
	return {
		getID : function() {return unitDDO.id;},
		getLevel : function() {return unitDDO.level;},
		levelUp : levelUp,
		getMovementType : function() {return unitTypeLDDO.movementType;},
		getImageName : function() {return unitTypeLDDO.imageName;},
		getLongTypeName : function() {return unitTypeLDDO.longName;},
		getHP : function() {return unitDDO.hp;},
		setHP : function(newValue) {unitDDO.hp = newValue;},
		modifyHP : function(modBy) {unitDDO.hp = unitDDO.hp + modBy;},
		getMaxHP : function() {return unitDDO.maxHP;},
		setMaxHP : function(newValue) {unitDDO.maxHP = newValue;},
		modifyMaxHP : function(modBy) {unitDDO.maxHP = unitDDO.maxHP + modBy;},
		getMovementSpeed : function() {return unitDDO.movementSpeed;},
		setMovementSpeed : function(newValue) {unitDDO.movementSpeed = newValue;},
		modifyMovementSpeed : function(modBy) {unitDDO.movementSpeed = unitDDO.movementSpeed + modBy;}
	};
}

//tile Type - used for tiles in play
function Tile(theTileTypeID, theID, theXPos, theYPos, theZPos, ifPlayerAllowedToDeploy) {
	"use strict";
	
	//declarations
	var id = theID,
	xPos = theXPos,
	yPos = theYPos,
	zPos = theZPos,
	tileTypeID = theTileTypeID,
	playerAllowedToDeploy = ifPlayerAllowedToDeploy,
	createJSTile = {},
	
	getTileType = function() {
		return FeldzugApp.Data.getTileTypes().getObjectByID(tileTypeID);
	};
	
	//constructor

	//reveal public API
	return {
		getID : function() {return id;},
		getXPos : function() {return xPos;},
		getYPos : function() {return yPos;},
		getZPos : function() {return zPos;},
		getLongTypeName : function() {return getTileType().longName;},
		getTileImageName : function() {return getTileType().imageName;},
		getMovementCostForMovementType : function(theMovementType) {return getTileType().movementCost[theMovementType];},
		getVisibilityCost : function() {return getTileType().visibilityCost;},
		getMovementCostRawArray : function() {return getTileType().movementCost;},
		getPlayerAllowedToDeploy : function() {return playerAllowedToDeploy;},
		setCreateJSTile : function(theCreateJSTile) {createJSTile = theCreateJSTile;},
		getCreateJSTile : function() {return createJSTile;}
	};
}