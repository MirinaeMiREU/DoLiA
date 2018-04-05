function Mound(game, xPos, yPos) {
	this.game = game;
	this.ctx = game.ctx;
	this.xPos = xPos;
	this.yPos = yPos;
	this.counter = 0;	
	this.antsOut = 0;
	this.colony = [];
	Entity.call(this, game, xPos * 10, yPos * 10);
}

Mound.prototype = new Entity();
Mound.prototype.constructor = Mound;

Mound.prototype.update = function() {
	this.tiles[this.yPos][this.xPos].outPheromone+=100;
	this.counter++;
	if (this.counter > COUNT_TIL && this.antsOut < MAX_ANTS) {
		var ant = new Ant(this.game, 39, 29, this.colony, this.tiles);
		this.colony.push(ant);
		this.game.addEntity(ant);
		this.counter = 0;
		this.antsOut++;
	}
	this.draw();
}

Mound.prototype.draw = function() {
	this.ctx.fillStyle = "green";
	
	this.ctx.fillRect(this.x, this.y, 10, 10);
	this.ctx.fillStyle = "black";
	this.ctx.strokeRect(this.x, this.y, 10, 10);
}

Mound.prototype.setTiles = function(tiles) {
	this.tiles = tiles;
}