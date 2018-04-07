function Mound(game, xPos, yPos) {
	this.game = game;
	this.ctx = game.ctx;
	this.xPos = xPos;
	this.yPos = yPos;
	this.counter = 0;	
	this.antsOut = 0;
	this.colony = [];
	Entity.call(this, game, xPos * CELL_SIZE, yPos * CELL_SIZE);
}

Mound.prototype = new Entity();
Mound.prototype.constructor = Mound;

Mound.prototype.update = function() {
	this.tiles[this.yPos][this.xPos].outPheromone=MAX_PHEROMONE;
	this.counter++;
	if (this.counter > COUNT_TIL && this.antsOut < MAX_ANTS) {
		var ant = new Ant(this.game, 
						  Math.round(XSIZE/2)-1, 
						  Math.round(YSIZE/2)-1, 
						  this.colony, 
						  this.tiles);
		this.colony.push(ant);
		this.game.addEntity(ant);
		this.counter = 0;
		this.antsOut++;
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