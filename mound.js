function Mound(game, xPos, yPos) {
	this.game = game;
	this.ctx = game.ctx;
	this.xPos = xPos;
	this.yPos = yPos;
	this.updateCounter = 0;
	this.antCount = 0;
	this.larvaCount = 0;
	this.foodStorage = 0;
	this.lifeTimeCount = 0;
	this.colony = [];
	this.larvae = [];
	Entity.call(this, game, xPos * CELL_SIZE, yPos * CELL_SIZE);
}

Mound.prototype = new Entity();
Mound.prototype.constructor = Mound;

Mound.prototype.update = function() {
	this.tiles[this.yPos][this.xPos].outPheromone=MAX_PHEROMONE;
	if (this.colony.length <= 0) {
		console.log(this.foodStorage);
		this.game.pauseGame();
	}
	if (this.updateCounter >= 50) {
		console.log("Ant:" + this.antCount + 
					" Larva:" + this.larvaCount + 
					" Food:" + this.foodStorage);
		this.updateRoleHistogram();
		this.updateForageHistogram();
		this.updateCounter = 0;
	}
	
	if (this.lifeTimeCount >= GAME_LIFE_TIME) {
		this.game.pauseGame();
	}
	
	this.lifeTimeCount++;
	this.updateCounter++;
	this.draw();
}

Mound.prototype.draw = function() {
	this.ctx.fillStyle = "green";
	
	this.ctx.fillRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
	this.ctx.fillStyle = "black";
	this.ctx.strokeRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
}

Mound.prototype.setTiles = function(tiles) {
	this.tiles = tiles;
}

Mound.prototype.spawnAnt = function() {
	var dev = Math.random() * MAX_DEVIATION;
	dev = Math.random() > 0.5 ? dev : -dev;
	var dev2 = Math.random() * MAX_DEVIATION;
	dev2 = Math.random() > 0.5 ? dev2 : -dev2;
	var randomAnt = this.colony[Math.floor(this.antCount*Math.random())];
	var ant;
	if (randomAnt === undefined) {
		ant = new Ant(this.game, 
					  Math.round(XSIZE/2)-1, 
				  	  Math.round(YSIZE/2)-1, 
					  this.colony, 
					  this.tiles,
					  this,
					  0.5,
					  0.5);
	} else if (Math.random() < MUTATION_RATE) {
		ant = new Ant(this.game, 
					  Math.round(XSIZE/2)-1, 
				  	  Math.round(YSIZE/2)-1, 
					  this.colony, 
					  this.tiles,
					  this,
					  randomAnt.geneRole + dev,
					  randomAnt.geneForage + dev2);
	} else {
		ant = new Ant(this.game, 
					  Math.round(XSIZE/2)-1, 
				  	  Math.round(YSIZE/2)-1, 
					  this.colony, 
					  this.tiles,
					  this,
					  randomAnt.geneRole,
					  randomAnt.geneForage);
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
	console.log("role: " + roleHistogram);
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
}