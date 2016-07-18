
//pathfinderStep
function pathfinderStep(theCorrespondingTile, thePrev, theMovementType, theHScore) {
	"use strict";
	
	//offer y and x getters

	var correspondingTile = theCorrespondingTile, //everything in js is a reference
		prevStep = thePrev,
		movementCost = theCorrespondingTile.getMovementCostForMovementType(theMovementType),
		hScore = theHScore,
		fScore = hScore,
		totalMovementCostFromCache = null,

	getTotalMovementCostFrom = function() {
		if (totalMovementCostFromCache === null) {
			totalMovementCostFromCache = movementCost;
			if (prevStep !== null) {
				totalMovementCostFromCache += prevStep.getTotalMovementCostFrom();
			}
		}
		return totalMovementCostFromCache;
	},

	setPrevStep = function(newPrevStep){
		prevStep = newPrevStep;
		totalMovementCostFromCache = null;
		fScore = hScore + prevStep.getTotalMovementCostFrom();
	};

	//constructor
	if (prevStep !== null) {
		fScore += prevStep.getTotalMovementCostFrom();
	}

	//reveal public API
	return {
		//getters
		getCorrespondingTile: function() { return correspondingTile; },
		getPrevStep: function() { return prevStep; },
		getTotalMovementCostFrom: getTotalMovementCostFrom,
		getFScore: function() { return fScore; },
		//setters
		setPrevStep: setPrevStep
	};
}


FeldzugApp.Pathfinder = function() {
	"use strict";

	var

	//util function
	getLowestFScoreStep = function(listOfSteps) {
		return listOfSteps.reduce(function(prev, curr) {
			if (curr.getFScore() < prev.getFScore()) {
				return curr;
			} else {
				return prev;
			}
		});

	},

	//actual pathfinding
	resolveFromTo = function(fromTile, toTile, unit) {
		//declarations
		var
			openList = [],
			closedList = [],
			currentStep = {},
			possibleIndex = -1,
			possibleNextSteps = [],
			resTileArray = [], //this is just here for debugging futher down the code

		//util functions
		considerPossibleNextStep = function(index, nextStep) {
			var tile = FeldzugApp.GameController.Data.getTileAt(nextStep.x, nextStep.y);
		
			if (tile !== null && //is a tile
				tile.getMovementCostForMovementType(unit.movementType) !== 0) { //has movement cost for movement type

				if (listContainsStepWithCoordinates(nextStep.x, nextStep.y, closedList) === -1) { //only proceed if step not yet considered

					//already planned to consider?
					possibleIndex = listContainsStepWithCoordinates(nextStep.x, nextStep.y, openList);

					if (possibleIndex === -1) { //if not yet planned to consider

						//prep and remember step
						openList.unshift( new pathfinderStep(
							tile,
							currentStep,
							unit.getMovementType(),
							Math.abs(toTile.getXPos() - nextStep.x) + Math.abs(toTile.getYPos() - nextStep.y)
						));

					} else if (openList[possibleIndex].getPrevStep().getTotalMovementCostFrom() > currentStep.getTotalMovementCostFrom()) { //if already planned to consider and current path is better

						//update planned to consider step with better path
						openList[possibleIndex].setPrevStep(currentStep);
					}
				}
			}
		};

		//returns index or -1
		function listContainsStepWithCoordinates(coordinatesX, coordinatesY, stepsList) {
			var i = 0;

			for (; i < stepsList.length; i += 1) {
				if (stepsList[i].getCorrespondingTile().getXPos() === coordinatesX && stepsList[i].getCorrespondingTile().getYPos() === coordinatesY) {
					return i;
				}
			}
			return -1;
		}

		//actual function

		//remember first step
		openList.unshift( new pathfinderStep(
			fromTile,
			null,
			unit.getMovementType(),
			Math.abs(toTile.getXPos() - fromTile.getXPos()) + Math.abs(toTile.getYPos() - fromTile.getYPos())
		));

		//loop until no possible steps or break because path found
		while (openList.length > 0) {

			//get most promissing step from not considered steps
			currentStep = getLowestFScoreStep(openList);

			//move step to considered steps
			closedList.unshift(currentStep);
			openList.splice(openList.indexOf(currentStep), 1);

			possibleIndex = listContainsStepWithCoordinates(toTile.getXPos(), toTile.getYPos(), closedList);
			if (possibleIndex > -1) { //is target in considered steps?
				
				while (true) {
					resTileArray.unshift(currentStep.getCorrespondingTile()); //return tiles to move over in proper order (incl. start and end)
					
					if (currentStep.getPrevStep() === null) {
						currentStep = currentStep.getPrevStep(); //more steps
					} else {
						break; //no more steps
					}
				}
				break; //don't even consider more steps
			}

			//for each adjacent square
			possibleNextSteps =[
				{x: currentStep.getCorrespondingTile().getXPos() + 1, y: currentStep.getCorrespondingTile().getYPos()},
				{x: currentStep.getCorrespondingTile().getXPos() - 1, y: currentStep.getCorrespondingTile().getYPos()},
				{x: currentStep.getCorrespondingTile().getXPos(), y: currentStep.getCorrespondingTile().getYPos() + 1},
				{x: currentStep.getCorrespondingTile().getXPos(), y: currentStep.getCorrespondingTile().getYPos() - 1}
			];
			$.each(possibleNextSteps, considerPossibleNextStep);
		}

		return resTileArray;
	};

	//reveal public API
	return {
		resolveFromTo: resolveFromTo
	};

}();