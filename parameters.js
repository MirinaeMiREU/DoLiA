// main
var CELL_SIZE = 20;
var XSIZE = Math.floor(800/CELL_SIZE);
var YSIZE = Math.floor(600/CELL_SIZE);

var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;

var GAME_LIFE_TIME = 1000000;

//tile
var MAX_PHEROMONE = XSIZE*10;
var MULT = Math.round(MAX_PHEROMONE/10);
var DECAY_RATE = Math.round(MAX_PHEROMONE/200);
var MAX_TILE_FOOD = 1000;
var FOOD_ABUNDANCE = 0.1;
var FOOD_REGEN_AMOUNT = Math.round(Math.random()*MAX_TILE_FOOD);
var FOOD_REPLENISH_AMOUNT = MAX_TILE_FOOD/10;
var FOOD_REGEN_RATE = 0.005;
var FOOD_REPLENISH_RATE = 0.02;
var FOOD_REGEN_DELAY = 100;
var FOOD_REPLENISH_DELAY = 100;

// mound
var MAX_ANTS = 10;
var COUNT_TIL = 10;

// ant
var EXPLORE = 0;
var EXPLOIT = 1;
var LAY_EGG = 2;
var CARE_EGG = 3;

var LAY_TIME = 50;
var MIN_LAY_TIME = LAY_TIME/10;
var CARE_TIME = 10;

var DEATH_AGE = 0;
var DEATH_HUNGER = 1;

var LIFETIME = 1000;
var HUNGER_THRESHHOLD = MAX_PHEROMONE;
var EAT_AMOUNT = 10;
var MUTATION_RATE = 0.5;
var MAX_DEVIATION = 0.1;

var OUTBOUND = 0;
var INBOUND = 1;

var MAX_ENERGY = MAX_PHEROMONE;
var MIN_ENERGY = MAX_ENERGY/10;
var MAX_ANT_FOOD = 10;
var MIN_ANT_FOOD = MAX_ANT_FOOD/10;
var FOOD_COLLECT_RATE = 2;
var ENERGY_DECAY = 5;

// larva

var MATURE_TIME = 100;
