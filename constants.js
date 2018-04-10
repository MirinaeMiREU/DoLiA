// main
const CELL_SIZE = 20;
const XSIZE = Math.floor(800/CELL_SIZE);
const YSIZE = Math.floor(600/CELL_SIZE);

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

//tile
const MAX_PHEROMONE = 200;
const MULT = Math.round(MAX_PHEROMONE/10);
const DECAY_RATE = 2;

const MAX_TILE_FOOD = 1000;

//mound
const MAX_ANTS = 10;
const COUNT_TIL = 10;

// ant
const EXPLORE = 0;
const EXPLOIT = 1;

const OUTBOUND = 0;
const INBOUND = 1;

const MAX_ENERGY = 200;
const MAX_ANT_FOOD = 10;
const FOOD_COLLECT_RATE = 2;
const ENERGY_DECAY = 5;

