function Ant(game, xPos, yPos) {
	this.xPos = xPos;
	this.yPos = yPos;
	this.game = game;
	this.ctx = game.ctx;
	this.tiles = [];	
	var rand = Math.random();
	Entity.call(this, game, xPos * 10, yPos * 10);
}

Ant.prototype = new Entity();
Ant.prototype.constructor = Ant;

Ant.prototype.update = function() {
	var rand = Math.random();
	
	this.draw();
}

Ant.prototype.draw = function() {
	this.ctx.fillStyle = "#ABCDEF";
	
	this.ctx.fillRect(this.x+2, this.y+2, 6, 6);
	
	this.ctx.fillStyle = "black";
	this.ctx.strokeRect(this.x, this.y, 10, 10);
}

Ant.prototype.setNeighbors = function(neighbors) {
	this.neighbors = neighbors;
}