function Tile(game, xPos, yPos) {
	this.game = game;
	this.ctx = game.ctx;
	this.xPos = xPos;
	this.yPos = yPos;
	this.outPheromone = 0;
	this.inPheromone = 0;
	this.isHome = false;
	this.foodLevel = 0;
	this.neighbors = [];	
	
	var rand = Math.random();
	if (rand > 0.99) {
		this.foodLevel = 100;
	} else if (rand > 0.95) {
		this.foodLevel = 25;
	} else {
		this.foodLevel = 0;
	}
	Entity.call(this, game, xPos * 10, yPos * 10);
}

Tile.prototype = new Entity();
Tile.prototype.constructor = Tile;

Tile.prototype.update = function() {
	
	var maxOut = this.outPheromone;
	var maxIn = this.inPheromone;
	/*
	for (var i = 0; i < this.neighbors.length; i++) {
		var tile = this.neighbors[i];
	//	if ((tile.outPheromone-150) > maxOut)
	//		maxOut = (tile.outPheromone-150);
		if (Math.floor(tile.inPheromone*2/3)> maxIn)
			maxIn = Math.floor(tile.inPheromone*2/3);
	}
	//Math.floor(tile.outPheromone*2/3)
	
	//this.outPheromone = 
	//	this.outPheromone < maxOut ?
	//	maxOut : this.outPheromone;
	this.inPheromone = 
		this.inPheromone < maxIn ?
		maxIn : this.inPheromone;
	*/
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
		
	
	this.draw();
}

Tile.prototype.draw = function() {
	if (this.foodLevel > 0) {
		this.ctx.fillStyle = "#444444";
	} else {
		this.ctx.fillStyle = "#FFFFFF";
	}
	this.ctx.fillRect(this.x, this.y, 5, 5);
	
	if (this.outPheromone <= 0) {
		this.ctx.fillStyle = "#FFFFFF";
	} else if (this.outPheromone <= MULT) {
		this.ctx.fillStyle = "#FFE6E6";
	} else if (this.outPheromone <= MULT*2) {
		this.ctx.fillStyle = "#FFCDCD";
	} else if (this.outPheromone <= MULT*3) {
		this.ctx.fillStyle = "#FFB4B4";
	} else if (this.outPheromone <= MULT*4) {
		this.ctx.fillStyle = "#FF9B9B";
	} else if (this.outPheromone <= MULT*5) {
		this.ctx.fillStyle = "#FF8282";
	} else if (this.outPheromone <= MULT*6) {
		this.ctx.fillStyle = "#FF6969";
	} else if (this.outPheromone <= MULT*7) {
		this.ctx.fillStyle = "#FF5050";
	} else if (this.outPheromone <= MULT*8) {
		this.ctx.fillStyle = "#FF3737";
	} else if (this.outPheromone <= MULT*9) {
		this.ctx.fillStyle = "#FF1E1E";
	} else {
		this.ctx.fillStyle = "#FF0000";
	}

	this.ctx.fillRect(this.x+5, this.y, 5, 5);
	if (this.inPheromone <= 0) {
		this.ctx.fillStyle = "#FFFFFF";
	} else if (this.inPheromone <= MULT) {
		this.ctx.fillStyle = "#E6E6FF";
	} else if (this.inPheromone <= MULT*2) {
		this.ctx.fillStyle = "#CDCDFF";
	} else if (this.inPheromone <= MULT*3) {
		this.ctx.fillStyle = "#B4B4FF";
	} else if (this.inPheromone <= MULT*4) {
		this.ctx.fillStyle = "#9B9BFF";
	} else if (this.inPheromone <= MULT*5) {
		this.ctx.fillStyle = "#8282FF";
	} else if (this.inPheromone <= MULT*6) {
		this.ctx.fillStyle = "#6969FF";
	} else if (this.inPheromone <= MULT*7) {
		this.ctx.fillStyle = "#5050FF";
	} else if (this.inPheromone <= MULT*8) {
		this.ctx.fillStyle = "#3737FF";
	} else if (this.inPheromone <= MULT*9) {
		this.ctx.fillStyle = "#1E1EFF";
	} else {
		this.ctx.fillStyle = "#0000FF";
	}
	this.ctx.fillRect(this.x+5, this.y+5, 5, 5);

	this.ctx.fillStyle = "black";
	this.ctx.strokeRect(this.x, this.y, 10, 10);	
}

Tile.prototype.setNeighbors = function(neighbors) {
	this.neighbors = neighbors;
}

Tile.prototype.setHome = function() {
	var mound = new Mound(this.game, 39, 29);
	this.isHome = true;
	this.game.addEntity(mound);
	return mound;
}