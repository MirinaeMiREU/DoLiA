AM = new AssetManager();

AM.queueDownload("./img/knight/IDLE.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");	
    var gameEngine = new GameEngine();
	
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
	
	
    gameEngine.init(ctx);
	gameEngine.start();
	
    console.log("All Done!");
});