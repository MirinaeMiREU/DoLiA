window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
	this.isPaused = true;
	this.ticked = false;
	this.isStepping = true;
	this.play = null;
	this.pause = null;
	this.step = null;
	this.save = null;
	this.load = null;
	this.newMap = null;
	this.newAnt = null;
	this.updateCounter = 0;
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
	this.setup();
    this.startInput();
	
    console.log('game initialized');
}

GameEngine.prototype.reinit = function() {
	// main
	CELL_SIZE = parseInt(document.getElementById("cellSize").value);
	XSIZE = Math.floor(800/CELL_SIZE);
	YSIZE = Math.floor(600/CELL_SIZE);

	NORTH = 0;
	EAST = 1;
	SOUTH = 2;
	WEST = 3;

	GAME_LIFE_TIME = parseInt(document.getElementById("simDuration").value);
	UPDATE_PERIOD = parseInt(document.getElementById("updatePeriod").value);

	// mound
	INIT_ANTS = parseInt(document.getElementById("initPop").value);

	// ant
	EXPLORE = 0;
	EXPLOIT = 1;
	LAY_EGG = 2;

	LAY_TIME = parseInt(document.getElementById("maxEggLayTime").value);
	MIN_LAY_TIME = parseInt(document.getElementById("minEggLayTime").value);

	FORAGE_WEIGHT = Number(document.getElementById("forageWeight").value);
	BREED_WEIGHT = Number(document.getElementById("breedWeight").value);

	DEATH_AGE = 0;
	DEATH_HUNGER = 1;

	CHANCE_TO_DIE = Number(document.getElementById("deathChance").value);
	HUNGER_THRESHHOLD = parseInt(document.getElementById("hungerThreshold").value);
	EAT_AMOUNT = parseInt(document.getElementById("foodIntake").value);
	MUTATION_RATE = Number(document.getElementById("mutationRate").value);
	MAX_DEVIATION = Number(document.getElementById("maxDev").value);

	OUTBOUND = 0;
	INBOUND = 1;

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
	MAX_TILE_FOOD = parseInt(document.getElementById("maxFood").value);
	FOOD_ABUNDANCE = Number(document.getElementById("foodAbundance").value);
	FOOD_REGEN_AMOUNT = Number(document.getElementById("foodRegenAmount").value);
	FOOD_REPLENISH_AMOUNT = Number(document.getElementById("foodReplenishAmount").value);
	FOOD_REGEN_RATE = Number(document.getElementById("foodRegenRate").value);
	FOOD_REPLENISH_RATE = Number(document.getElementById("foodReplenishRate").value);
	
	this.entities = [];
	this.setup();
	this.updateCounter = 0;
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
	var mound = squares[Math.round(YSIZE/2)-1][Math.round(XSIZE/2)-1].setHome();
	mound.setTiles(squares);
	
	for (var i = 0; i < INIT_ANTS; i++) {
		mound.spawnAnt();
	}
	var graph = new Graph(this, mound);
	this.addEntity(graph);
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
	(function gameLoop() {
		that.loop();
		requestAnimFrame(gameLoop, that.ctx.canvas);
	})();
}

GameEngine.prototype.restart = function() {
	console.log("restarting game");
    this.reinit();
}

GameEngine.prototype.pauseGame = function() {
	console.log("pausing game");
	this.isPaused = true;
}

GameEngine.prototype.resumeGame = function() {
	console.log("resuming game");
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
		that.restart();
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
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
		if (entity != undefined) {
			entity.update();
		}
    }
}

GameEngine.prototype.updatePeriod = function () {
    var entitiesCount = this.entities.length;
	if (this.updateCounter >= UPDATE_PERIOD) {
		for (var i = 0; i < entitiesCount; i++) {
			var entity = this.entities[i];
			if (entity != undefined) {
				entity.updatePeriod();
			}
		}
		this.updateCounter = 0;
	}
	this.updateCounter++;
}

GameEngine.prototype.loop = function () {
	if (this.isStepping) {
		this.updatePeriod();
		this.update();
		this.draw();
		this.isStepping = false;
	}
	if (!this.isPaused) {
		this.clockTick = this.timer.tick();
		this.updatePeriod();
		this.update();
		this.draw();
		
		/*
		if (this.timer.gameTime % 0.05 > 0.025 && !this.ticked) {
			this.update();
			this.draw();
			this.ticked = true;
			//console.log("tick");
		} else if (this.timer.gameTime % 0.05 <= 0.025 && this.ticked){
			this.ticked = false;
			//console.log("tock");
		}
		*/
	}
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}