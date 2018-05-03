function Mound(game, xPos, yPos) {
	this.game = game;
	this.ctx = game.ctx;
	this.xPos = xPos;
	this.yPos = yPos;
	this.antCount = 0;
	this.larvaCount = 0;
	this.foodStorage = 0;
	this.lifeTimeCount = 0;
	this.tick = 0;
	this.colony = [];
	this.breedable = [];
	this.larvae = [];
	this.roleHistogram = [];
	this.forageHistogram = [];
	this.averageGen = 0;
	Entity.call(this, game, xPos * CELL_SIZE, yPos * CELL_SIZE);
}

Mound.prototype = new Entity();
Mound.prototype.constructor = Mound;

Mound.prototype.update = function() {
	this.tiles[this.yPos][this.xPos].outPheromone=MAX_PHEROMONE;
	if (this.colony.length <= 0 || this.lifeTimeCount >= GAME_LIFE_TIME) {
		console.log(this.foodStorage);
		this.game.saveGame();
		this.game.restart();
	}
	
	this.lifeTimeCount++;
}

Mound.prototype.updatePeriod = function() {
	console.log("Tick #:" + this.tick +
				" Cycle #:" + this.lifeTimeCount +
				" Ant:" + this.antCount + 
				" Larva:" + this.larvaCount + 
				" Food:" + this.foodStorage +
				" Gen:" + this.averageGen);
	this.tick++;
	this.updateRoleHistogram();
	this.updateForageHistogram();
	this.updateBreedableAnts();
	this.updateAverageGeneration();
}

Mound.prototype.draw = function() {
	this.ctx.fillStyle = "green";
	
	this.ctx.fillRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
	this.ctx.fillStyle = "black";
	this.ctx.strokeRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
}

Mound.prototype.drawPeriod = function() {
}

Mound.prototype.setTiles = function(tiles) {
	this.tiles = tiles;
}

Mound.prototype.spawnAnt = function() {
	var dev = Math.random() * MAX_DEVIATION;
	dev = Math.random() >= 0.5 ? dev : -dev;
	var dev2 = Math.random() * MAX_DEVIATION;
	dev2 = Math.random() >= 0.5 ? dev2 : -dev2;
	var randomAnt = this.breedable[Math.floor(this.breedable.length*Math.random())];
	var ant;
	if (randomAnt === undefined) {
		ant = new Ant(this.game, 
					  Math.round(XSIZE/2)-1, 
				  	  Math.round(YSIZE/2)-1, 
					  this.colony, 
					  this.tiles,
					  this,
					  0.5,
					  0.5,
					  0);
	} else if (Math.random() < MUTATION_RATE) {
		ant = new Ant(this.game, 
					  Math.round(XSIZE/2)-1, 
				  	  Math.round(YSIZE/2)-1, 
					  this.colony, 
					  this.tiles,
					  this,
					  randomAnt.geneRole + dev,
					  randomAnt.geneForage + dev2,
					  randomAnt.generation + 1);
	} else {
		ant = new Ant(this.game, 
					  Math.round(XSIZE/2)-1, 
				  	  Math.round(YSIZE/2)-1, 
					  this.colony, 
					  this.tiles,
					  this,
					  randomAnt.geneRole,
					  randomAnt.geneForage,
					  randomAnt.generation + 1);
	}
	
	this.colony.push(ant);
	this.game.addEntity(ant);
	this.antCount++;
}

Mound.prototype.removeAnt = function(ant, reason) {
	var colIndex = this.colony.indexOf(ant);
	this.colony.splice(colIndex, 1);
	this.game.removeEntity(ant);
	/*
	if (reason === DEATH_AGE) {
		console.log("age");
	} else if (reason === DEATH_HUNGER) {
		console.log("hunger");
	}
	*/
	this.antCount--;
}

Mound.prototype.spawnLarva = function(parent) {
	var larva = new Larva(this.game, this, parent);
	this.larvae.push(larva);
	this.game.addEntity(larva);
	this.larvaCount++;
}
Mound.prototype.removeLarva = function(larva) {
	var colIndex = this.colony.indexOf(larva);
	this.larvae.splice(colIndex, 1); 
	this.game.removeEntity(larva);
	this.larvaCount--;
}

Mound.prototype.canGrow = function() {
	return this.foodStorage > ((this.larvaCount+this.antCount)*EAT_AMOUNT);
}

Mound.prototype.updateRoleHistogram = function() {
	var roleHistogram = [];
	for (var i = 0; i < 20; i++) {
		roleHistogram.push(0);
	}
	for (var i = 0; i < this.colony.length; i++) {		
		var ant = this.colony[i];
		if (ant.geneRole <= 0.05) {
			roleHistogram[0]++;
		} else if (ant.geneRole <= 0.1) {
			roleHistogram[1]++;
		} else if (ant.geneRole <= 0.15) {
			roleHistogram[2]++;
		} else if (ant.geneRole <= 0.20) {
			roleHistogram[3]++;
		} else if (ant.geneRole <= 0.25) {
			roleHistogram[4]++;
		} else if (ant.geneRole <= 0.3) {
			roleHistogram[5]++;
		} else if (ant.geneRole <= 0.35) {
			roleHistogram[6]++;
		} else if (ant.geneRole <= 0.4) {
			roleHistogram[7]++;
		} else if (ant.geneRole <= 0.45) {
			roleHistogram[8]++;
		} else if (ant.geneRole <= 0.5) {
			roleHistogram[9]++;
		} else if (ant.geneRole <= 0.55) {
			roleHistogram[10]++;
		} else if (ant.geneRole <= 0.6) {
			roleHistogram[11]++;
		} else if (ant.geneRole <= 0.65) {
			roleHistogram[12]++;
		} else if (ant.geneRole <= 0.7) {
			roleHistogram[13]++;
		} else if (ant.geneRole <= 0.75) {
			roleHistogram[14]++;
		} else if (ant.geneRole <= 0.8) {
			roleHistogram[15]++;
		} else if (ant.geneRole <= 0.85) {
			roleHistogram[16]++;
		} else if (ant.geneRole <= 0.9) {
			roleHistogram[17]++;
		} else if (ant.geneRole <= 0.95) {
			roleHistogram[18]++;
		} else {
			roleHistogram[19]++;
		}
	}
	console.log("breed/forage: " + roleHistogram);
	this.roleHistogram = roleHistogram;
}

Mound.prototype.updateForageHistogram = function() {
	var histogram = [];
	for (var i = 0; i < 20; i++) {
		histogram.push(0);
	}
	for (var i = 0; i < this.colony.length; i++) {		
		var ant = this.colony[i];
		if (ant.geneForage <= 0.05) {
			histogram[0]++;
		} else if (ant.geneForage <= 0.1) {
			histogram[1]++;
		} else if (ant.geneForage <= 0.15) {
			histogram[2]++;
		} else if (ant.geneForage <= 0.20) {
			histogram[3]++;
		} else if (ant.geneForage <= 0.25) {
			histogram[4]++;
		} else if (ant.geneForage <= 0.3) {
			histogram[5]++;
		} else if (ant.geneForage <= 0.35) {
			histogram[6]++;
		} else if (ant.geneForage <= 0.4) {
			histogram[7]++;
		} else if (ant.geneForage <= 0.45) {
			histogram[8]++;
		} else if (ant.geneForage <= 0.5) {
			histogram[9]++;
		} else if (ant.geneForage <= 0.55) {
			histogram[10]++;
		} else if (ant.geneForage <= 0.6) {
			histogram[11]++;
		} else if (ant.geneForage <= 0.65) {
			histogram[12]++;
		} else if (ant.geneForage <= 0.7) {
			histogram[13]++;
		} else if (ant.geneForage <= 0.75) {
			histogram[14]++;
		} else if (ant.geneForage <= 0.8) {
			histogram[15]++;
		} else if (ant.geneForage <= 0.85) {
			histogram[16]++;
		} else if (ant.geneForage <= 0.9) {
			histogram[17]++;
		} else if (ant.geneForage <= 0.95) {
			histogram[18]++;
		} else {
			histogram[19]++;
		}
	}
	console.log("exploit/explore: " + histogram);
	this.forageHistogram = histogram;
}

Mound.prototype.updateBreedableAnts = function() {
	var breed = [];
	var breed2 = [];
	
	// first pass to get better half
	var cutoff = this.getAverageFitness(this.colony);
	for (var i = 0; i < this.colony.length; i++) {
		if (this.colony[i] !== undefined && 
			this.colony[i].overallFitness >= cutoff) {
			breed.push(this.colony[i]);
		}
	}
	
	// second pass to get the best quarter
	var cutoff2 = this.getAverageFitness(breed);
	for (var i = 0; i < breed.length; i++) {
		if (breed[i] !== undefined &&
			breed[i].overallFitness >= cutoff2) {
			breed2.push(breed[i]);
		}
	}
	
	//console.log(breed2.length);
	this.breedable = breed2;
}

Mound.prototype.getAverageFitness = function(arr) {
	var total = 0;
	var count = 0;
	
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] !== undefined) {
			total += arr[i].overallFitness;
			count++;
		}
	}
	
	return total/count;
}

Mound.prototype.updateAverageGeneration = function() {
	var total = 0;
	
	for (var i = 0; i < this.colony.length; i++) {
		if (this.colony[i] !== undefined) {
			total += this.colony[i].generation;
		}
	}
	
	var average = total/this.colony.length;
	this.averageGen = Math.round(average);
}