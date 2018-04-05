const EXPLORE = 0;
const EXPLOIT = 1;

const OUTBOUND = 0;
const INBOUND = 1;

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;


function Ant(game, xPos, yPos, peers, tiles) {
	this.xPos = xPos;
	this.yPos = yPos;
	this.dir = Math.floor(Math.random() * 4);
	this.food = 0;
	this.energy = 100;
	this.action = OUTBOUND;
	this.game = game;
	this.ctx = game.ctx;
	this.role = EXPLORE;
	this.tiles = tiles;	
	this.peers = peers;
	Entity.call(this, game, xPos * 10, yPos * 10);
}

Ant.prototype = new Entity();
Ant.prototype.constructor = Ant;

Ant.prototype.update = function() {
	var curTile = this.tiles[this.yPos][this.xPos];
	var tileFood = curTile.foodLevel;
	this.diverge();
	this.decide();
	if (this.energy > 0) {
		this.energy--;
	}
	console.log("out:" + curTile.outPheromone + " in:" + curTile.inPheromone);
	this.draw();
}

Ant.prototype.draw = function() {
	if (this.food >= 10) {
		this.ctx.fillStyle = "#004400";
	} else if (this.food > 5) {
		this.ctx.fillStyle = "#008800";
	} else if (this.food > 0) {
		this.ctx.fillStyle = "#00BB00";
	} else {
		this.ctx.fillStyle = "#00FF00";
	}
	
	this.ctx.fillRect(this.x+2, this.y+2, 6, 6);
	
	switch(this.dir) {
		case NORTH:
			this.ctx.fillRect(this.x+4, this.y-5, 2, 6);
			break;
		case EAST:
			this.ctx.fillRect(this.x+9, this.y+4, 6, 2);
			break;
		case SOUTH:
			this.ctx.fillRect(this.x+4, this.y+9, 2, 6);
			break;
		case WEST:
			this.ctx.fillRect(this.x-5, this.y+4, 6, 2);
	}
}

Ant.prototype.setNeighbors = function(neighbors) {
	this.neighbors = neighbors;
}

Ant.prototype.turnRight = function() {
	this.dir = this.dir + 1 > 3 ? 0 : this.dir + 1;
}

Ant.prototype.turnLeft = function() {
	this.dir = this.dir - 1 < 0 ? 3 : this.dir - 1;	
}

Ant.prototype.turnAround = function() {
	this.dir = this.dir + 2 > 3 ? (this.dir + 2) %4 : this.dir + 2;
}

Ant.prototype.move = function() {
	switch (this.dir) {
		case NORTH:
			this.yPos--;
			this.y -= 10;
			break;
		case WEST:
			this.xPos--;
			this.x -= 10;
			break;
		case EAST:
			this.xPos++;
			this.x += 10;
			break;
		case SOUTH:
			this.yPos++;
			this.y += 10;
	}
}

Ant.prototype.randomDir = function() {
	this.dir = Math.floor(Math.random() * 4);
}

Ant.prototype.lookLeft = function() {
	var curTile = this.tiles[this.yPos][this.xPos];
	switch (this.dir) {
		case NORTH:
			return curTile.neighbors[WEST];
		case WEST:
			return curTile.neighbors[SOUTH];
		case EAST:
			return curTile.neighbors[NORTH];
		case SOUTH:
			return curTile.neighbors[EAST];
	}
}

Ant.prototype.lookRight = function() {
	var curTile = this.tiles[this.yPos][this.xPos];
	switch (this.dir) {
		case NORTH:
			return curTile.neighbors[EAST];
		case WEST:
			return curTile.neighbors[NORTH];
		case EAST:
			return curTile.neighbors[SOUTH];
		case SOUTH:
			return curTile.neighbors[WEST];
	}
}

Ant.prototype.lookAhead = function() {
	var curTile = this.tiles[this.yPos][this.xPos];
	switch (this.dir) {
		case NORTH:
			return curTile.neighbors[NORTH];
		case WEST:
			return curTile.neighbors[WEST];
		case EAST:
			return curTile.neighbors[EAST];
		case SOUTH:
			return curTile.neighbors[SOUTH];
	}
}

Ant.prototype.diverge = function() {
	for (var i = 0; i < this.peers.length; i++) {
		var peer = this.peers[i];
		if (peer !== this && 
			this.xPos === peer.xPos &&
			this.yPos === peer.yPos &&
			this.action === OUTBOUND &&
			peer.action === OUTBOUND ) {
			if (Math.random() > 0.5) {
				this.turnRight();
			} else {
				this.turnLeft();
			}
		}
	}
}

Ant.prototype.decide = function() {
	var curTile = this.tiles[this.yPos][this.xPos];
	var tileFood = curTile.foodLevel;
	/*
	if (this.role === EXPLORE) {
	
	}
	*/
	if (curTile.isHome && this.action === INBOUND) {
		this.energy = 150;
		this.food = 0;
		this.action = OUTBOUND;
		this.turnAround();
	} else if (this.food >= 10 && this.action === OUTBOUND) {
		this.action = INBOUND;
		this.energy = 100;
		this.turnAround();
	} else if (tileFood > 0 && this.action === OUTBOUND) {
		curTile.foodLevel--;
		this.food++;
		curTile.inPheromone += this.energy;
	} else if (this.action === OUTBOUND) {
		this.decideDir(OUTBOUND);
		this.move();
		curTile.outPheromone += this.energy;
	} else if (this.action === INBOUND) { // Going back home
		this.decideDir(INBOUND);
		this.move();
		curTile.inPheromone += this.energy;
	}
	
	if (this.yPos <= 0) {
		if (this.dir === NORTH) {
			this.yPos = 59;
			this.y = this.yPos * 10;
		}
			
	} else if (this.yPos >= 59) {
		if (this.dir === SOUTH) {
			this.yPos = 0;
			this.y = this.yPos * 10;
		}
			
	}
	if (this.xPos <= 0) {
		if (this.dir === WEST) {
			this.xPos = 79;
			this.x = this.xPos * 10;
		}
	} else if (this.xPos >= 79) {
		if (this.dir === EAST) {
			this.xPos = 0;
			this.x = this.xPos * 10;
		}
			
	}
}

Ant.prototype.decideDir = function(action) {
	var curTile = this.tiles[this.yPos][this.xPos];
	if (action === INBOUND) {
		if (this.lookAhead().outPheromone > 0) {
			if (this.lookRight().outPheromone > (this.lookLeft().outPheromone + 10) &&
				this.lookRight().outPheromone > (this.lookAhead().outPheromone + 10)) {
				console.log("r:" + this.lookRight().outPheromone +
							" a:" + this.lookAhead().outPheromone +
							" l:" + this.lookLeft().outPheromone);
				this.turnRight();
				console.log("r");
			} else if (this.lookLeft().outPheromone > (this.lookRight().outPheromone + 10) &&
					   this.lookLeft().outPheromone > (this.lookAhead().outPheromone + 10)) {
				console.log("r:" + this.lookRight().outPheromone +
							" a:" + this.lookAhead().outPheromone +
							" l:" + this.lookLeft().outPheromone);
				this.turnLeft();
				console.log("l");
			}
		} else {
			var rand = Math.random();
			if (rand > 0.85) {
				if (rand > 0.925) {
					this.turnRight();
				} else {
					this.turnLeft();
				}
			}
		}
	} else {
		if (this.lookRight().inPheromone > (this.lookLeft().inPheromone + 10) &&
			this.lookRight().inPheromone > (this.lookAhead().inPheromone + 10)) {
			this.turnRight();
		} else if (this.lookLeft().inPheromone > (this.lookRight().inPheromone + 10) &&
				   this.lookLeft().inPheromone > (this.lookAhead().inPheromone + 10)) {
			this.turnLeft();
		} else {
			var rand = Math.random();
			if (rand > 0.85) {
				if (rand > 0.925) {
					this.turnRight();
				} else {
					this.turnLeft();
				}
			}
		}
	}
}