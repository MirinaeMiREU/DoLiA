var foods = 0;

function Tile(game, xPos, yPos) {
	this.game = game;
	this.ctx = game.ctx;
	this.xPos = xPos;
	this.yPos = yPos;
	this.outPheromone = 0;
	this.inPheromone = 0;
	this.isHome = false;
	this.foodLevel = 0;
	this.foodRegenCount = 0;
	this.foodReplenishCount = 0;
	this.neighbors = [];	
	
	if ((this.xPos > 0 && this.xPos < XSIZE-1) && 
		(this.yPos > 0 && this.yPos < YSIZE-1)) {
		var rand = Math.random();
		if (rand < FOOD_ABUNDANCE) {
			if (MAX_TOTAL_FOOD - foods >= MAX_TILE_FOOD) {
				this.foodLevel = MAX_TILE_FOOD;
				foods += MAX_TILE_FOOD;
			} else if (MAX_TOTAL_FOOD - foods > 0 &&
					   MAX_TOTAL_FOOD - foods < MAX_TILE_FOOD){
				this.foodLevel += MAX_TOTAL_FOOD - foods;
				foods = MAX_TOTAL_FOOD;
			}
		} else {
			this.foodLevel = 0;
		}
	}
	Entity.call(this, game, xPos * CELL_SIZE, yPos * CELL_SIZE);
}

Tile.prototype = new Entity();
Tile.prototype.constructor = Tile;

Tile.prototype.update = function() {
	foods += this.foodLevel;
	for (var i = 0; i < this.neighbors.length; i++) {
		var tile = this.neighbors[i];
		tile.outPheromone = (Math.floor(this.outPheromone/2)) > tile.outPheromone ?
							Math.floor(this.outPheromone/2) : tile.outPheromone;
		tile.inPheromone = (Math.floor(this.inPheromone/2)) > tile.inPheromone ?
						   Math.floor(this.inPheromone/2) : tile.inPheromone;
	}
	
	if (this.inPheromone > MAX_PHEROMONE) 
		this.inPheromone = MAX_PHEROMONE;
	if (this.outPheromone > MAX_PHEROMONE)
		this.outPheromone = MAX_PHEROMONE;
	
	if (this.inPheromone > 0) {
		this.inPheromone -= DECAY_RATE;
		if (this.inPheromone < 0)
			this.inPheromone = 0;
	}
	if (this.outPheromone > 0) {
		this.outPheromone -= DECAY_RATE;
		if (this.outPheromone < 0)
			this.outPheromone = 0;
	}
	
	//this.draw();
}

Tile.prototype.updatePeriod = function() {
	if ((this.xPos > 0 && this.xPos < XSIZE-1) && 
		(this.yPos > 0 && this.yPos < YSIZE-1)) {
		var neighborsEmpty = this.noNeighborsWithin(FOOD_DENSITY);

		if (this.foodLevel <= 0 && 
			Math.random() < FOOD_REGEN_RATE &&
			neighborsEmpty) {
			if (MAX_TOTAL_FOOD - foods >= FOOD_REGEN_AMOUNT) {
				this.foodLevel = FOOD_REGEN_AMOUNT;
				foods += FOOD_REGEN_AMOUNT;
			} else if (MAX_TOTAL_FOOD - foods > 0 &&
					   MAX_TOTAL_FOOD - foods < FOOD_REGEN_AMOUNT) {
				this.foodLevel += MAX_TOTAL_FOOD - foods; 
				foods = MAX_TOTAL_FOOD;
			}
		} else if (this.foodLevel > 0 && 
				   this.foodLevel < MAX_TILE_FOOD &&
				   Math.random() < FOOD_REPLENISH_RATE) {
			if (MAX_TOTAL_FOOD - foods >= FOOD_REPLENISH_AMOUNT) {
				if (this.foodLevel + FOOD_REPLENISH_AMOUNT > MAX_TILE_FOOD) {
					foods += MAX_TILE_FOOD - this.foodLevel;
					this.foodLevel = MAX_TILE_FOOD;
				} else {
					this.foodLevel += FOOD_REPLENISH_AMOUNT;
					foods += FOOD_REPLENISH_AMOUNT;
				}
			} else if (MAX_TOTAL_FOOD - foods > 0 &&
					   MAX_TOTAL_FOOD - foods < FOOD_REPLENISH_AMOUNT) {
				if (MAX_TOTAL_FOOD - foods >= MAX_TILE_FOOD - this.foodLevel) {
					foods += MAX_TILE_FOOD - this.foodLevel;
					this.foodLevel = MAX_TILE_FOOD;
				} else {
					this.foodLevel += MAX_TOTAL_FOOD - foods;
					foods = MAX_TOTAL_FOOD;
				}
			}
		}
	}
}

Tile.prototype.draw = function() {
	if (this.foodLevel >= MAX_TILE_FOOD) {
		this.ctx.fillStyle = "#111111";
	} else if (this.foodLevel >= Math.round(MAX_TILE_FOOD*4/5)) {
		this.ctx.fillStyle = "#222222";
	} else if (this.foodLevel >= Math.round(MAX_TILE_FOOD*3/5)) {
		this.ctx.fillStyle = "#444444";
	} else if (this.foodLevel >= Math.round(MAX_TILE_FOOD*2/5)) {
		this.ctx.fillStyle = "#666666";
	} else if (this.foodLevel >= Math.round(MAX_TILE_FOOD*1/5)) {
		this.ctx.fillStyle = "#999999";
	} else if (this.foodLevel > 0) {
		this.ctx.fillStyle = "#BBBBBB";
	} else {
		this.ctx.fillStyle = "#FFFFFF";
	}
	this.ctx.fillRect(this.x, 
					  this.y, 
					  Math.round(CELL_SIZE/2), 
					  Math.round(CELL_SIZE/2));
	
	if (this.outPheromone <= 0) {
		this.ctx.fillStyle = "#FFFFFF";
	} else if (this.outPheromone <= MULT) {
		this.ctx.fillStyle = "#FFDDDD";
	} else if (this.outPheromone <= MULT*2) {
		this.ctx.fillStyle = "#FFBBBB";
	} else if (this.outPheromone <= MULT*3) {
		this.ctx.fillStyle = "#FF9999";
	} else if (this.outPheromone <= MULT*4) {
		this.ctx.fillStyle = "#FF8888";
	} else if (this.outPheromone <= MULT*5) {
		this.ctx.fillStyle = "#FF7777";
	} else if (this.outPheromone <= MULT*6) {
		this.ctx.fillStyle = "#FF6666";
	} else if (this.outPheromone <= MULT*7) {
		this.ctx.fillStyle = "#FF5555";
	} else if (this.outPheromone <= MULT*8) {
		this.ctx.fillStyle = "#FF4444";
	} else if (this.outPheromone <= MULT*9) {
		this.ctx.fillStyle = "#FF3333";
	} else {
		this.ctx.fillStyle = "#FF2222";
	}

	this.ctx.fillRect(this.x+Math.round(CELL_SIZE/2), 
					  this.y, 
					  Math.round(CELL_SIZE/2), 
					  Math.round(CELL_SIZE/2));
	if (this.inPheromone <= 0) {
		this.ctx.fillStyle = "#FFFFFF";
	} else if (this.inPheromone <= MULT) {
		this.ctx.fillStyle = "#DDDDFF";
	} else if (this.inPheromone <= MULT*2) {
		this.ctx.fillStyle = "#BBBBFF";
	} else if (this.inPheromone <= MULT*3) {
		this.ctx.fillStyle = "#9999FF";
	} else if (this.inPheromone <= MULT*4) {
		this.ctx.fillStyle = "#8888FF";
	} else if (this.inPheromone <= MULT*5) {
		this.ctx.fillStyle = "#7777FF";
	} else if (this.inPheromone <= MULT*6) {
		this.ctx.fillStyle = "#6666FF";
	} else if (this.inPheromone <= MULT*7) {
		this.ctx.fillStyle = "#5555FF";
	} else if (this.inPheromone <= MULT*8) {
		this.ctx.fillStyle = "#4444FF";
	} else if (this.inPheromone <= MULT*9) {
		this.ctx.fillStyle = "#3333FF";
	} else {
		this.ctx.fillStyle = "#2222FF";
	}
	this.ctx.fillRect(this.x+Math.round(CELL_SIZE/2), 
					  this.y+Math.round(CELL_SIZE/2), 
					  Math.round(CELL_SIZE/2), 
					  Math.round(CELL_SIZE/2));

	this.ctx.fillStyle = "black";
	this.ctx.strokeRect(this.x, this.y, CELL_SIZE, CELL_SIZE);	
}

Tile.prototype.drawPeriod = function() {
}

Tile.prototype.setNeighbors = function(neighbors) {
	this.neighbors = neighbors;
}

Tile.prototype.noNeighborsWithin = function(density) {
	for (var i = this.yPos-density; i < this.yPos+density; i++) {
		for (var j = this.xPos-density; j < this.xPos+density; j++) {
			if (i >= 0 && i < YSIZE && j >= 0 && j < XSIZE &&
				this.game.mound.tiles[i][j].foodLevel > 0) {
				return false;
			}
		}
	}
	return true;
}

Tile.prototype.setHome = function() {
	var mound = new Mound(this.game, 
						  Math.round(XSIZE/2)-1, 
						  Math.round(YSIZE/2)-1);
	this.isHome = true;
	this.foodLevel = 0;
	//this.game.addEntity(mound);
	
	return mound;
}