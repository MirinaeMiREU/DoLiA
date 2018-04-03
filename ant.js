const EXPLORE = 0;
const EXPLOIT = 1;

const OUTBOUND = 0;
const INBOUND = 1;

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

function Ant(game, xPos, yPos, tiles) {
	this.xPos = xPos;
	this.yPos = yPos;
	this.dir = Math.floor(Math.random() * 4);
	this.food = 0;
	this.action = OUTBOUND;
	this.game = game;
	this.ctx = game.ctx;
	this.role = EXPLORE;
	this.tiles = tiles;	
	Entity.call(this, game, xPos * 10, yPos * 10);
}

Ant.prototype = new Entity();
Ant.prototype.constructor = Ant;

Ant.prototype.update = function() {
	var curTile = this.tiles[this.yPos][this.xPos];
	var tileFood = curTile.foodLevel;
	
	if (curTile.isHome && this.action === INBOUND) {
		this.food = 0;
		this.action = OUTBOUND;
		this.turnAround();
	} else if (this.food >= 10 && this.action === OUTBOUND) {
		this.action = INBOUND;
		this.turnAround();
	} else if (tileFood > 0 && this.action === OUTBOUND) {
		curTile.foodLevel--;
		this.food++;
	} else if (this.action === OUTBOUND) {
		var rand = Math.random();
		this.move();
		if (curTile.inPheromone > 0) {
			if (this.lookRight.inPheromone > this.lookLeft.inPheromone &&
				this.lookRight.inPheromone > this.lookAhead.inPheromone) {
				this.turnRight();
			} else if (this.lookLeft.inPheromone > this.lookRight.inPheromone &&
					   this.lookLeft.inPheromone > this.lookAhead.inPheromone) {
				this.turnLeft();
			}
		} else {
			if (rand > 0.85) {
				if (rand > 0.925) {
					this.turnRight();
				} else {
					this.turnLeft();
				}
			}
		}
		if (curTile.outPheromone < 500) {
			curTile.outPheromone += 150;
		} else {
			curTile.outPheromone += 50;
		}
	} else if (this.action === INBOUND) { // Going back home
		var rand = Math.random();
		this.move();
		if (curTile.outPheromone > 0) {
			if (this.lookRight().outPheromone > this.lookLeft().outPheromone &&
				this.lookRight().outPheromone > this.lookAhead().outPheromone) {
				this.turnRight();
			} else if (this.lookLeft().outPheromone > this.lookRight().outPheromone &&
					   this.lookLeft().outPheromone > this.lookAhead().outPheromone) {
				this.turnLeft();
			}
		} else {
			if (rand > 0.85) {
				if (rand > 0.925) {
					this.turnRight();
				} else {
					this.turnLeft();
				}
			}
		}

		if (curTile.inPheromone < 500) {
			curTile.inPheromone += 150;
		} else {
			curTile.inPheromone += 50;
		}
	}
	
	if (this.yPos <= 1) {
		if (this.dir === NORTH) {
			this.yPos = 58;
			this.y = this.yPos * 10;
		}
			
	} else if (this.yPos >= 58) {
		if (this.dir === SOUTH) {
			this.yPos = 1;
			this.y = this.yPos * 10;
		}
			
	}
	if (this.xPos <= 1) {
		if (this.dir === WEST) {
			this.xPos = 78;
			this.x = this.xPos * 10;
		}
	} else if (this.xPos >= 78) {
		if (this.dir === EAST) {
			this.xPos = 1;
			this.x = this.xPos * 10;
		}
			
	}
	/*
	if (this.yPos <= 1) {
		if (this.xPos <= 1) {
			while (this.dir === NORTH || this.dir === WEST) {
				this.dir = Math.floor(Math.random() * 4);
			}
		} else if (this.xPos >= 78) {
			while (this.dir === NORTH || this.dir === EAST) {
				this.dir = Math.floor(Math.random() * 4);
			}
		} else {
			while (this.dir === NORTH) {
				this.dir = Math.floor(Math.random() * 4);
			}
		}
	}
	if (this.yPos >= 58) {
		if (this.xPos <= 1) {
			while (this.dir === SOUTH || this.dir === WEST) {
				this.dir = Math.floor(Math.random() * 4);
			}
		} else if (this.xPos >= 78) {
			while (this.dir === SOUTH || this.dir === EAST) {
				this.dir = Math.floor(Math.random() * 4);
			}
		} else {
			while (this.dir === SOUTH) {
				this.dir = Math.floor(Math.random() * 4);
			}
		}
	}
	if (this.xPos <= 1) {
		while (this.dir === WEST) {
			this.dir = Math.floor(Math.random() * 4);
		}
	}
	if (this.xPos >= 78) {
		while (this.dir === EAST) {
			this.dir = Math.floor(Math.random() * 4);
		}
	}*/
	
	this.draw();
}

Ant.prototype.draw = function() {
	this.ctx.fillStyle = "#00FF00";
	
	this.ctx.fillRect(this.x+2, this.y+2, 6, 6);
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
	switch (this.dir) {
		case NORTH:
			return this.tiles[this.yPos][this.xPos-1];
		case WEST:
			return this.tiles[this.yPos+1][this.xPos];
		case EAST:
			return this.tiles[this.yPos-1][this.xPos];
		case SOUTH:
			return this.tiles[this.yPos][this.xPos+1];
	}
}

Ant.prototype.lookRight = function() {
	switch (this.dir) {
		case NORTH:
			return this.tiles[this.yPos][this.xPos+1];
		case WEST:
			return this.tiles[this.yPos-1][this.xPos];
		case EAST:
			return this.tiles[this.yPos+1][this.xPos];
		case SOUTH:
			return this.tiles[this.yPos][this.xPos-1];
	}
}

Ant.prototype.lookAhead = function() {
	switch (this.dir) {
		case NORTH:
			return this.tiles[this.yPos-1][this.xPos];
		case WEST:
			return this.tiles[this.yPos][this.xPos-1];
		case EAST:
			return this.tiles[this.yPos][this.xPos+1];
		case SOUTH:
			return this.tiles[this.yPos+1][this.xPos];
	}
}