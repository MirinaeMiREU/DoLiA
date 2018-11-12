window.requestAnimFrame = (function () {
    return function (/* function */ callback, /* DOMElement */ element) {
		window.setTimeout(callback, 4);
	};
            
})();
/*
window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
*/

function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
	this.isPaused = false;
	this.ticked = false;
	this.isStepping = false;
	this.play = null;
	this.pause = null;
	this.step = null;
	this.save = null;
	this.load = null;
	this.newMap = null;
	this.newAnt = null;
	this.mound = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
	this.play = document.getElementById("play");
	this.pause = document.getElementById("pause");
	this.step = document.getElementById("step");
	this.save = document.getElementById("save");
	this.load = document.getElementById("load");
	this.newMap = document.getElementById("newMap");
	this.newAnt = document.getElementById("newAnt");
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
	this.timer = new Timer();
	document.getElementById("seasonDiv").innerHTML = "Season 1<br />" +
	"<input type='text' id='seasonLength1' value='1000'/>Length<br />" +
	"<input type='text' id='foodRegenRate1' value='0'/>Food Regen Rate<br />" +
	"<input type='text' id='foodRegenAmount1' value='0'/>Food Regen Amount<br />" +
	"<input type='text' id='foodReplenishRate1' value='0'/>Food Replenish Rate<br />" +
	"<input type='text' id='foodReplenishAmount1' value='0'/>Food Replenish Amount<br />" +
	"<input type='text' id='foodDensity1' value='0'/>Food Density<br />";
	this.setParameters();
	this.setup();
    this.startInput();
    console.log('sim initialized');
}

GameEngine.prototype.setParameters = function() {
	// main
	CELL_SIZE = parseInt(document.getElementById("cellSize").value);
	XSIZE = Math.floor(800/CELL_SIZE);
	YSIZE = Math.floor(600/CELL_SIZE);

	GAME_LIFE_TIME = parseInt(document.getElementById("simDuration").value);
	UPDATE_PERIOD = parseInt(document.getElementById("updatePeriod").value);
	DRAW_PERIOD = parseInt(document.getElementById("drawPeriod").value);
	MAX_RUN_COUNT = parseInt(document.getElementById("runCount").value);

	// mound
	INIT_ANTS = parseInt(document.getElementById("initPop").value);
	
	GENE_TOGGLE = document.getElementById("geneToggle").checked;
	BREED_TOGGLE = document.getElementById("breedToggle").checked;
	EFFECT_TOGGLE = document.getElementById("effectToggle").checked;
	BREEDER_STANDBY = document.getElementById("breedStandby").checked;
	BREEDER_LIFE_TOGGLE = document.getElementById("breederLifeToggle").checked;

	BREEDER_PENALTY_TOGGLE = document.getElementById("standbyPenaltyToggle").checked;
	BREEDER_PENALTY_AMOUNT = Number(document.getElementById("standbyPenalty").value);

	LAY_TIME = parseInt(document.getElementById("maxEggLayTime").value);
	MIN_LAY_TIME = parseInt(document.getElementById("minEggLayTime").value);

	FORAGE_WEIGHT = Number(document.getElementById("forageWeight").value);
	BREED_WEIGHT = Number(document.getElementById("breedWeight").value);

	CHANCE_TO_DIE = Number(document.getElementById("deathChance").value);
	MIN_AGE = Number(document.getElementById("minAge").value);
	HUNGER_THRESHHOLD = parseInt(document.getElementById("hungerThreshold").value);
	EAT_AMOUNT = parseInt(document.getElementById("foodIntake").value);
	MUTATION_RATE = Number(document.getElementById("mutationRate").value);
	MAX_DEVIATION = Number(document.getElementById("maxDev").value);

	MAX_ENERGY = parseInt(document.getElementById("maxEnergy").value);
	MIN_ENERGY = parseInt(document.getElementById("minEnergy").value);
	MAX_ANT_FOOD = parseInt(document.getElementById("maxCarryingCapacity").value);
	MIN_ANT_FOOD = parseInt(document.getElementById("minCarryingCapacity").value);
	ENERGY_DECAY = parseInt(document.getElementById("energyDecay").value);

	// larva

	MATURE_TIME = parseInt(document.getElementById("matureTime").value);

	//tile
	MAX_PHEROMONE = MAX_ENERGY;
	MULT = Math.ceil(MAX_PHEROMONE/10);
	DECAY_RATE = Math.ceil(MAX_PHEROMONE/200);
	MAX_TOTAL_FOOD = parseInt(document.getElementById("maxTotalFood").value);
	MAX_TILE_FOOD = parseInt(document.getElementById("maxFood").value);
	FOOD_ABUNDANCE = Number(document.getElementById("foodAbundance").value);
	NUM_OF_SEASONS = Number(document.getElementById("seasons").value);

	SEASON_LENGTH = Number(document.getElementById("seasonLength1").value);
	FOOD_REGEN_AMOUNT = Number(document.getElementById("foodRegenAmount1").value);
	FOOD_REPLENISH_AMOUNT = Number(document.getElementById("foodReplenishAmount1").value);
	FOOD_REGEN_RATE = Number(document.getElementById("foodRegenRate1").value);
	FOOD_REPLENISH_RATE = Number(document.getElementById("foodReplenishRate1").value);
	
	this.entities = [];
	this.updateCounter = 0;
	this.seasonCounter = 0;
	this.currentSeason = 0;
}

GameEngine.prototype.setup = function() {
	var squares = [];
	
	for (var i = 0; i < YSIZE; i++) {
		squares.push([]);
		for (var j = 0; j < XSIZE; j++) {
			var tile = new Tile(this, j, i);
			squares[i].push(tile);
			this.addEntity(tile);
		}
	}
	
	for (var i = 0; i < YSIZE; i++) {
		for (var j = 0; j < XSIZE; j++) {
			if (i == 0 || i == YSIZE-1 || j == 0 || j == XSIZE-1) {
				squares[i][j].foodLevel = 0;
			}
		}
	}
	
	
	for (var i = 0; i < YSIZE; i++) {
		for (var j = 0; j < XSIZE; j++) {
			var neighbors = [];
			if (i === 0) {
				neighbors.push(squares[YSIZE-1][j]);
				if (j === 0) {
					neighbors.push(squares[i][j+1]);
					neighbors.push(squares[i+1][j]);
					neighbors.push(squares[i][XSIZE-1]);
				} else if (j === XSIZE-1) {
					neighbors.push(squares[i][0]);
					neighbors.push(squares[i+1][j]);
					neighbors.push(squares[i][j-1]);
				} else {
					neighbors.push(squares[i][j+1]);
					neighbors.push(squares[i+1][j]);
					neighbors.push(squares[i][j-1]);
				}
			} else if (i === YSIZE-1) {
				neighbors.push(squares[i-1][j]);
				if (j === 0) {
					neighbors.push(squares[i][j+1]);
					neighbors.push(squares[0][j]);
					neighbors.push(squares[i][XSIZE-1]);
				} else if (j === XSIZE-1) {
					neighbors.push(squares[i][0]);
					neighbors.push(squares[0][j]);
					neighbors.push(squares[i][j-1]);
				} else {
					neighbors.push(squares[i][j+1]);
					neighbors.push(squares[0][j]);
					neighbors.push(squares[i][j-1]);
				}
			} else if (j === 0) {
				neighbors.push(squares[i-1][j]);
				neighbors.push(squares[i][j+1]);
				neighbors.push(squares[i+1][j]);
				neighbors.push(squares[i][XSIZE-1]);
			} else if (j === XSIZE-1) {
				neighbors.push(squares[i-1][j]);
				neighbors.push(squares[i][0]);
				neighbors.push(squares[i+1][j]);
				neighbors.push(squares[i][j-1]);
			} else {
				neighbors.push(squares[i-1][j]);
				neighbors.push(squares[i][j+1]);
				neighbors.push(squares[i+1][j]);
				neighbors.push(squares[i][j-1]);
			}
			squares[i][j].setNeighbors(neighbors);
		}
	}
	this.mound = squares[Math.round(YSIZE/2)-1][Math.round(XSIZE/2)-1].setHome();
	this.mound.setTiles(squares);
	this.addEntity(this.mound.roleHistogramData);
	this.addEntity(this.mound.forageHistogramData);
	this.addEntity(this.mound.graph1);
	this.addEntity(this.mound.graph2);
	
	for (var i = 0; i < INIT_ANTS; i++) {
		this.mound.spawnAnt();
	}
}

GameEngine.prototype.start = function () {
	console.log("starting sim");
	this.pauseGame();
    var that = this;
	(function simLoop() {
		that.loop();
		requestAnimFrame(simLoop, that.ctx.canvas);
	})();
}

GameEngine.prototype.restart = function() {
	console.clear();
	var str = this.buildDownloadData(this.mound.graph1, this.mound.graph2, 
									 this.mound.roleHistogramData, this.mound.forageHistogramData);
	this.download(document.getElementById("filename").textContent+".csv", str);
	var runNum = Number(document.getElementById("runNum").innerHTML);
	runNum++;
	document.getElementById("runNum").innerHTML = runNum;
	console.log("restarting sim");
	foodTotal = 0;
    this.setParameters();
	this.setup();
}

GameEngine.prototype.newGame = function() {
	console.clear();
	document.getElementById("runNum").innerHTML = "1";
	console.log("starting new sim");
	foodTotal = 0;
    this.setParameters();
	this.setup();
}

GameEngine.prototype.download = function(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}

GameEngine.prototype.saveGame = function() {
}

GameEngine.prototype.pauseGame = function() {
	console.log("pausing sim");
	this.isPaused = true;
}

GameEngine.prototype.endGame = function() {
	console.log("ending sim");
	this.isPaused = true;
	var str = this.buildDownloadData(this.mound.graph1, this.mound.graph2, 
									 this.mound.roleHistogramData, this.mound.forageHistogramData);
	this.download(document.getElementById("filename").textContent+".csv", str);
	this.download(document.getElementById("cellSize").value + "cS_" + 
				  document.getElementById("simDuration").value + "sD_" +
				  document.getElementById("updatePeriod").value + "cPT_" +
				  document.getElementById("drawPeriod").value + "cPSD_" + 
				  document.getElementById("maxFood").value + "mFV_" +
				  document.getElementById("maxTotalFood").value + "mTFOM_" +
				  document.getElementById("foodAbundance").value + "iFA_" +
				  document.getElementById("foodRegenRate").value + "-" +
				  document.getElementById("foodRegenAmount").value + "fReg_" +
				  document.getElementById("foodReplenishRate").value + "-" +
				  document.getElementById("foodReplenishAmount").value + "fRep_" +
				  document.getElementById("geneToggle").checked + "-tG_" +
				  document.getElementById("breedToggle").checked + "-tB_" +
				  document.getElementById("effectToggle").checked + "-tGE_" +
				  document.getElementById("breedStandby").checked + "-tBS_" +
				  document.getElementById("initPop").value + "iP_" +
				  document.getElementById("maxEnergy").value + "-" +
				  document.getElementById("minEnergy").value + "E_" +
				  document.getElementById("maxEggLayTime").value + "-" +
				  document.getElementById("minEggLayTime").value + "ELT_" +
				  document.getElementById("forageWeight").value + "fW_" +
				  document.getElementById("breedWeight").value + "bW_" +
				  document.getElementById("deathChance").value + "cTD_" +
				  document.getElementById("minAge").value + "mA_" +
				  document.getElementById("hungerThreshold").value + "hT_" +
				  document.getElementById("foodIntake").value + "fI_" +
				  document.getElementById("mutationRate").value + "mR_" +
				  document.getElementById("maxDev").value + "mD_" +
				  document.getElementById("maxCarryingCapacity").value + "-" +
				  document.getElementById("minCarryingCapacity").value + "CC_" +
				  document.getElementById("energyDecay").value + "eD_" +
				  document.getElementById("matureTime").value + "lMIC.txt", "");
}

GameEngine.prototype.resumeGame = function() {
	console.log("resuming sim");
	this.isPaused = false;
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        if (x < 1024) {
            x = Math.floor(x / 32);
            y = Math.floor(y / 32);
        }

        return { x: x, y: y };
    }

    var that = this;

    // event listeners are added here

	this.play.addEventListener("click", function (e) {
		that.resumeGame();
    }, false);
	
	this.pause.addEventListener("click", function (e) {
		that.pauseGame();
    }, false);
	
	this.step.addEventListener("click", function (e) {
		that.isStepping = true;
    }, false);
	
	this.save.addEventListener("click", function (e) {
		console.log("Doesn't do anything yet");
    }, false);
	
	this.load.addEventListener("click", function (e) {
		console.log("Doesn't do anything yet");
    }, false);
	
	this.newMap.addEventListener("click", function(e) {
		that.newGame();
	})
	
	this.newAnt.addEventListener("click", function(e) {
		that.restart();
	})
	

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    //console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.removeEntity = function(entity) {
	//console.log('Removed entity.');
	var index = this.entities.indexOf(entity);
	this.entities.splice(index, 1);
}

GameEngine.prototype.draw = function () {
	if (this.updateCounter % DRAW_PERIOD === 0) {
    this.ctx.clearRect(0, 0, SIM_X, SIM_Y);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
	}
}

GameEngine.prototype.drawPeriod = function() {
	if (this.updateCounter % UPDATE_PERIOD === 0) {
		this.ctx.clearRect(SIM_X, 0, CHART_X, CHART_Y);
		this.ctx.clearRect(0, SIM_Y, SIM_X+CHART_X, CHART_BOTTOM_Y);
		this.ctx.save();
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].drawPeriod(this.ctx);
		}
		this.ctx.restore();
	}
}

GameEngine.prototype.update = function () {
	foods = 0;
	if (this.seasonCounter / SEASON_LENGTH >= 1) {
		this.changeSeason();
	}
	
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
		if (entity != undefined) {
			entity.update();
		}
	}
	this.updateCounter++;
	this.seasonCounter++;
}

GameEngine.prototype.changeSeason = function () {
	this.seasonCounter = 0;
	this.currentSeason = this.currentSeason + 1 > NUM_OF_SEASONS-1 ? 0 : this.currentSeason + 1;
	var sL = "seasonLength" + Number(this.currentSeason + 1);
	var regA = "foodRegenAmount" + (this.currentSeason + 1);
	var repA = "foodReplenishAmount" + (this.currentSeason + 1);
	var regR = "foodRegenRate" + (this.currentSeason + 1);
	var repR = "foodReplenishRate" + (this.currentSeason + 1);
	var foodD = "foodDensity" + (this.currentSeason + 1);
	SEASON_LENGTH = Number(document.getElementById(sL).value);
	FOOD_REGEN_AMOUNT = Number(document.getElementById(regA).value);
	FOOD_REPLENISH_AMOUNT = Number(document.getElementById(repA).value);
	FOOD_REGEN_RATE = Number(document.getElementById(regR).value);
	FOOD_REPLENISH_RATE = Number(document.getElementById(repR).value);
	FOOD_DENSITY = Number(document.getElementById(foodD).value);
}

GameEngine.prototype.updatePeriod = function () {
    var entitiesCount = this.entities.length;
	if (this.updateCounter % UPDATE_PERIOD === 0) {
		for (var i = 0; i < entitiesCount; i++) {
			var entity = this.entities[i];
			if (entity != undefined) {
				entity.updatePeriod();
			}
		}
	}
	
}

GameEngine.prototype.loop = function () {
	if (this.isStepping) {
		this.updatePeriod();
		this.update();
		this.draw();
		this.drawPeriod();
		this.isStepping = false;
	}
	if (!this.isPaused) {
		this.clockTick = this.timer.tick();
		this.update();
		this.updatePeriod();
		this.draw();
		this.drawPeriod();
		
		/*
		if (this.timer.simTime % 0.05 > 0.025 && !this.ticked) {
			this.update();
			this.draw();
			this.ticked = true;
			//console.log("tick");
		} else if (this.timer.simTime % 0.05 <= 0.025 && this.ticked){
			this.ticked = false;
			//console.log("tock");
		}
		*/
	}
	
	
}

GameEngine.prototype.buildDownloadData = function(graph1, graph2, hist1, hist2) {
	var listNum = GAME_LIFE_TIME/UPDATE_PERIOD;
	
	var str = ",Ant,Larva,Food\n";
	for (var i = 1; i <= listNum; i++) {
		str += i + ",";
		if (graph1.antData.length >= i) {
			str += graph1.antData[i-1] + "," + 
			graph1.larvaData[i-1] + "," + 
			graph1.foodData[i-1];
		} else {
			str+="0,0,0";
		}
		str += "\n";
	}
	str+="\n,Ant+Larva,Food\n";
	for (var i = 1; i <= listNum; i++) {
		str += i + ",";
		if (graph1.antData.length >= i) {
			str += graph2.bioData[i-1] + "," + 
			graph2.foodData[i-1];
		} else {
			str+="0,0";
		}
		str += "\n";
	}
	str+="\n,Breed,0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,Forage\n";
	for (var i = 1; i <= listNum; i++) {
		str += i + ",";
		if (graph1.antData.length >= i) {
			str += hist1.data[i-1] + ",";
		} else {
			str+="0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
		}
		str += "\n";
	}
	str+="\n,Exploit,0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,Explore\n";
	for (var i = 1; i <= listNum; i++) {
		str += i + ",";
		if (graph1.antData.length >= i) {
			str += hist2.data[i-1] + ",";
		} else {
			str+="0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
		}
		str += "\n";
	}
	
	return str;
}

function Timer() {
    this.simTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var simDelta = Math.min(wallDelta, this.maxStep);
    this.simTime += simDelta;
    return simDelta;
}