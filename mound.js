function Mound(game, xPos, yPos) {
	this.game = game;
	this.ctx = game.ctx;
	this.xPos = xPos;
	this.yPos = yPos;
	this.antCount = 0;
	this.larvaCount = 0;
	this.foodStorage = 0;
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
	var ant = new Ant(this.game, 
					  Math.round(XSIZE/2)-1, 
					  Math.round(YSIZE/2)-1, 
					  this.colony, 
					  this.tiles,
					  this);
	this.colony.push(ant);
	this.game.addEntity(ant);
	this.antCount++;
}

Mound.prototype.removeAnt = function(ant, reason) {
	var colIndex = this.colony.indexOf(ant);
	this.colony.splice(colIndex, 1);
	this.game.removeEntity(ant);
	if (reason === DEATH_AGE) {
		console.log("age");
	} else if (reason === DEATH_HUNGER) {
		console.log("hunger");
	}
	this.antCount--;
}

Mound.prototype.spawnLarva = function() {
	var larva = new Larva(this.game, this);
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
	return this.foodStorage >= ((this.larvaCount+this.antCount)*EAT_AMOUNT);
}