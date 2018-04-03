function Tile(game, xPos, yPos, isHome) {
	var rand = Math.random();
	this.game = game;
	this.ctx = game.ctx;
	this.outgoingPheromoneLevel = rand > .8 ? 7 : 0;
	rand = Math.random();
	this.incomingPheromoneLevel = rand > .8 ? 4 : 0;
	this.foodLevel = 0;
	this.isHome = isHome;
	this.neighbors = [];	
	
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
	var maxOut = this.outgoingPheromoneLevel;
	var maxIn = this.incomingPheromoneLevel;
	for (var i = 0; i < 4; i++) {
		if (this.neighbors[i].outgoingPheromoneLevel-1 > maxOut)
			maxOut = this.neighbors[i].outgoingPheromoneLevel-1;
		if (this.neighbors[i].incomingPheromoneLevel-1 > maxIn)
			maxIn = this.neighbors[i].incomingPheromoneLevel-1;
	}
	
	this.outgoingPheromoneLevel = 
		this.outgoingPheromoneLevel < maxOut ?
		maxOut : this.outgoingPheromoneLevel;
	this.incomingPheromoneLevel = 
		this.incomingPheromoneLevel < maxIn ?
		maxIn : this.incomingPheromoneLevel;
	this.draw();
}

Tile.prototype.draw = function() {
	if (this.isHome) {
		this.ctx.fillStyle = "#113355";
		this.ctx.fillRect(this.x, this.y, 10, 10);
	} else {
		if (this.foodLevel > 0) {
			this.ctx.fillStyle = "#000000";
		} else {
			this.ctx.fillStyle = "#FFFFFF";
		}
		this.ctx.fillRect(this.x, this.y, 5, 5);
		
		switch (this.outgoingPheromoneLevel) {
			case 0:
				this.ctx.fillStyle = "#FFFFFF";
				break;
			case 1:
				this.ctx.fillStyle = "#FFE6E6";
				break;
			case 2:
				this.ctx.fillStyle = "#FFCDCD";
				break;
			case 3:
				this.ctx.fillStyle = "#FFB4B4";
				break;
			case 4:
				this.ctx.fillStyle = "#FF9B9B";
				break;
			case 5:
				this.ctx.fillStyle = "#FF8282";
				break;
			case 6:
				this.ctx.fillStyle = "#FF6969";
				break;
			case 7:
				this.ctx.fillStyle = "#FF5050";
				break;
			case 8:
				this.ctx.fillStyle = "#FF3737";
				break;
			case 9:
				this.ctx.fillStyle = "#FF1E1E";
				break;
			case 10:
				this.ctx.fillStyle = "#FF0000";
		}
		this.ctx.fillRect(this.x+5, this.y, 5, 5);
		switch (this.incomingPheromoneLevel) {
			case 0:
				this.ctx.fillStyle = "#FFFFFF";
				break;
			case 1:
				this.ctx.fillStyle = "#E6E6FF";
				break;
			case 2:
				this.ctx.fillStyle = "#CDCDFF";
				break;
			case 3:
				this.ctx.fillStyle = "#B4B4FF";
				break;
			case 4:
				this.ctx.fillStyle = "#9B9BFF";
				break;
			case 5:
				this.ctx.fillStyle = "#8282FF";
				break;
			case 6:
				this.ctx.fillStyle = "#6969FF";
				break;
			case 7:
				this.ctx.fillStyle = "#5050FF";
				break;
			case 8:
				this.ctx.fillStyle = "#3737FF";
				break;
			case 9:
				this.ctx.fillStyle = "#1E1EFF";
				break;
			case 10:
				this.ctx.fillStyle = "#0000FF";
		}
		this.ctx.fillRect(this.x+5, this.y+5, 5, 5);
	}
	this.ctx.fillStyle = "black";
	this.ctx.strokeRect(this.x, this.y, 10, 10);	
}

Tile.prototype.setNeighbors = function(neighbors) {
	this.neighbors = neighbors;
}