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
	this.standby = [];
	this.larvae = [];
	this.roleHistogram = [];
	this.forageHistogram = [];
	this.deathAges = {
		breeders: [],
		generalists: [],
		foragers: [],
	};
	this.averageAges = {
		breeders: 0,
		generalists: 0,
		foragers: 0,
		total: 0,
	};
	this.averageGen = 0;
	this.minGen = 0;
	this.maxGen = 0;
	this.graph1 = new Graph(game, this);
	this.graph2 = new Graph2(game, this);
	this.roleHistogramData = new Histogram(game, this, 810, 200, 0);
	this.forageHistogramData = new Histogram(game, this, 810, 400, 1);
	this.larvaPeriod = 0;
	this.larvaPeriodData = [];
	this.foragePeriod = 0;
	this.foragePeriodData = [];
	Entity.call(this, game, xPos * CELL_SIZE, yPos * CELL_SIZE);
}

Mound.prototype = new Entity();
Mound.prototype.constructor = Mound;

Mound.prototype.update = function() {
	this.tiles[this.yPos][this.xPos].outPheromone=MAX_PHEROMONE;
	this.lifeTimeCount++;
	if (this.colony.length <= 0) {
		this.game.runNextSetting();
	}
	if (this.lifeTimeCount >= GAME_LIFE_TIME) {
		/*
		if (parseInt(document.getElementById("runNum").innerHTML) < MAX_RUN_COUNT) {
			this.game.restart();
		} else {
			this.game.endGame();
		}
		*/
		this.game.runNextSetting();
	}	

	//console.log("Standby: " + this.standby.length);
	if (RANDOM_OR_QUEUE_TOGGLE) {
		while (this.canGrow() && this.standby.length > 0) {
			var size = this.standby.length;
			
			var rng = Math.floor(size * Math.random());
			this.standby[rng].eggLay();
			this.standby.splice(rng, 1);
		}
	} else {
		while (this.canGrow() && this.standby.length > 0) {
			this.standby[0].eggLay();
			this.standby.shift();
		}
	}
	

	if (BREEDER_PENALTY_TOGGLE) {
		for (var i = 0; i < this.standby.length; i++) {
			this.standby[i].standbyPenalty += BREEDER_PENALTY_AMOUNT;
		}
	}

	if (BREEDER_STANDBY) {
		var size = this.standby.length;
		for (var i = 0; i < size; i++) {
			var ant = this.standby[i];
			if (ant.standbyCounter > STANDBY_THRESHOLD) {
				ant.standbyCounter = 0;
				ant.role = INTERIM;
				this.standby.splice(i, 1);
				i--;
				size--;
			}
		}
	}
}

Mound.prototype.updatePeriod = function() {	
	this.tick++;
	this.larvaPeriodData.push(this.larvaPeriod);
	this.larvaPeriod = 0;
	this.foragePeriodData.push(this.foragePeriod);
	this.foragePeriod = 0;
	this.updateRoleHistogram();
	this.updateForageHistogram();
	this.updateBreedableAnts();
	this.updateGeneration();
	this.graph1.updatePeriod();
	this.graph2.updatePeriod();
	this.roleHistogramData.updatePeriod();
	this.forageHistogramData.updatePeriod();
	this.calculateAvgAges();

	console.log("Tick #:" + this.tick +
				" Cycle #:" + this.lifeTimeCount +
				" Ant:" + this.antCount + 
				" Larva:" + this.larvaCount + 
				" Food:" + this.foodStorage);
	console.log("Min Gen:" + this.minGen +
				" Avg Gen:" + this.averageGen + 
				" Max Gen:" + this.maxGen);
	console.log(`Avg Breeder Age: ${this.averageAges.breeders}`);
	console.log(`Avg Generalist Age: ${this.averageAges.generalists}`);
	console.log(`Avg Forager Age: ${this.averageAges.foragers}`);
	console.log(`Avg Age: ${this.averageAges.total}`);
	/*
	console.log("Food Total: " + foods);
	console.log("Standby Total: " + this.standby.length);
	console.log("Food Foraged: " + this.foragePeriod);
	console.log("Larva Created: " + this.larvaPeriod);
	*/
}

Mound.prototype.draw = function() {
	this.ctx.fillStyle = "green";
	
	this.ctx.fillRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
	this.ctx.fillStyle = "black";
	this.ctx.strokeRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
}

Mound.prototype.drawPeriod = function() {
	this.ctx.strokeStyle = "#000000";
	this.ctx.fillSytle = "#000000";
	this.ctx.font = "20px Courier";
	this.ctx.fillText("Min Gen:" + this.minGen,600, 630);
	this.ctx.fillText("Average Gen:" + this.averageGen,600, 650);
	this.ctx.fillText("Max Gen:" + this.maxGen,600, 670);
	this.ctx.fillText("Cycle# :" + this.lifeTimeCount,600, 690);
	this.ctx.font = "10px sans-serif";
	this.graph1.drawPeriod();
	this.graph2.drawPeriod();
	this.roleHistogramData.drawPeriod();
	this.forageHistogramData.drawPeriod();
}

Mound.prototype.setTiles = function(tiles) {
	this.tiles = tiles;
}

Mound.prototype.calculateAvgAges = function() {
	var breedAvg = this.deathAges.breeders.length === 0 ? 0 :
		this.deathAges.breeders.reduce((a,b) => (a+b))/this.deathAges.breeders.length;
	var genAvg = this.deathAges.generalists.length === 0 ? 0 :
		this.deathAges.generalists.reduce((a,b) => (a+b))/this.deathAges.generalists.length;
	var forageAvg = this.deathAges.foragers.length === 0 ? 0 :
		this.deathAges.foragers.reduce((a,b) => (a+b))/this.deathAges.foragers.length;

	var totalLen = this.deathAges.breeders.length + this.deathAges.generalists.length + this.deathAges.foragers.length;
	var avg = totalLen === 0 ? 0 :
	this.deathAges.breeders.concat(this.deathAges.generalists.concat(this.deathAges.foragers)).reduce((a,b) => (a+b))/totalLen;

	this.averageAges = {
		breeders: breedAvg,
		generalists: genAvg,
		foragers: forageAvg,
		total: avg,
	}
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
					  1,
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
	this.antCount--;
}

Mound.prototype.spawnLarva = function(parent) {
	var larva = new Larva(this.game, this, parent);
	this.larvae.push(larva);
	this.game.addEntity(larva);
	this.larvaCount++;
	this.larvaPeriod++;
}
Mound.prototype.removeLarva = function(larva) {
	var colIndex = this.colony.indexOf(larva);
	this.larvae.splice(colIndex, 1); 
	this.game.removeEntity(larva);
	this.larvaCount--;
}

Mound.prototype.canGrow = function() {
	return this.foodStorage > ((this.larvaCount+this.antCount)*EAT_AMOUNT*2) ||
		   (BREED_TOGGLE) /*&& this.foodStorage > EAT_AMOUNT)*/;
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
	var cutoff = this.getAverageFitness(this.getBreedableAnts());
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

Mound.prototype.getBreedableAnts = function() {
	var ofAge = [];
	if (BREED_AGE_TOGGLE) {
		for (var i = 0; i < this.colony.length; i++) {
			if (this.colony[i].age >= BREED_AGE) {
				ofAge.push(this.colony[i]);
			}
		}
	} else {
		ofAge = this.colony;
	}
	return ofAge;
}

Mound.prototype.updateGeneration = function() {
	var total = 0;
	
	for (var i = 0; i < this.colony.length; i++) {
		if (this.colony[i] !== undefined) {
			total += this.colony[i].generation;
		}
	}
	
	if (this.colony.length > 0) {
		var average = total/this.colony.length;
		this.averageGen = Math.round(average);
	
		this.minGen = this.colony.reduce(function(min, cur) {
			return cur.generation < min.generation ? cur : min;
		}).generation;
		this.maxGen = this.colony.reduce(function(max, cur) {
			return cur.generation > max.generation ? cur : max;
		}).generation;
	}
}