function Tile(game, xPos, yPos, isHome) {
	this.game = game;
	this.ctx = game.ctx;
	this.outgoingPheromoneLevel = 0;
	this.incomingPheromoneLevel = 0;
	this.foodLevel = 0;
	this.isHome = isHome;
	this.neighbors = [];	
	var rand = Math.random();
	if (rand < 0.95) {
		this.foodLevel = 0;
	} else {
		this.foodLevel = 10;
	}
	Entity.call(this, game, xPos * 10, yPos * 10);
}

Tile.prototype = new Entity();
Tile.prototype.constructor = Tile;

Tile.prototype.update = function() {
	this.draw();
}

Tile.prototype.draw = function() {
	this.ctx.fillStyle = "black";
	this.ctx.strokeRect(this.x, this.y, 10, 10);
	if (this.foodLevel > 0) {
		this.ctx.fillStyle = "#DD3333";
	} else {
		this.ctx.fillStyle = "#FFFFFF";
	}
	this.ctx.fillRect(this.x, this.y, 5, 5);
	
	if (this.isHome) {
		this.ctx.fillStyle = "#113355";
		this.ctx.fillRect(this.x, this.y, 10, 10);
	}
	
	
}

Tile.prototype.setNeighbors = function(neighbors) {
	this.neighbors = neighbors;
}