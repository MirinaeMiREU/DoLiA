function Ant(game, xPos, yPos, peers, tiles, mound, geneRole, geneForage) {
	this.xPos = xPos;
	this.yPos = yPos;
	this.ctx = game.ctx;
	this.dir = Math.floor(Math.random() * 4);
	this.food = 0;
	this.age = 0;
	this.consecutiveTurns = 0;
	
	this.hunger = 0;
	this.action = OUTBOUND;
	this.role = EXPLOIT;
	this.tiles = tiles;
	this.peers = peers;
	this.mound = mound;
	this.geneRole = geneRole > 1 ? 1 : geneRole;
	this.geneRole = geneRole < 0 ? 0 : geneRole;
	this.geneForage = geneForage > 1 ? 1 : geneForage;
	this.geneForage = geneForage < 0 ? 0 : geneForage;
	this.energy = Math.ceil(MAX_ENERGY*this.geneRole) <= MIN_ENERGY ? 
				  MIN_ENERGY : Math.ceil(MAX_ENERGY*this.geneRole);
	this.maxEnergy = this.energy;
	this.layTime = Math.ceil(LAY_TIME*this.geneRole*2) <= MIN_LAY_TIME ?
				   MIN_LAY_TIME : Math.ceil(LAY_TIME*this.geneRole*2);
	this.maxFood = Math.ceil(MAX_ANT_FOOD*this.geneRole*2) <= MIN_ANT_FOOD ?
				   MIN_ANT_FOOD : Math.ceil(MAX_ANT_FOOD*this.geneRole*2);
	this.layTimer = 0;
	this.careTimer = 0;
	//console.log(geneRole + " " + geneForage);
	Entity.call(this, game, xPos * CELL_SIZE, yPos * CELL_SIZE);
}

Ant.prototype = new Entity();
Ant.prototype.constructor = Ant;

Ant.prototype.update = function() {
	if (this.age > LIFETIME) {
		this.die(DEATH_AGE);
	} else if (this.role === LAY_EGG) {
		if (this.layTimer >= this.layTime) {
			this.eggLay();
			this.chooseRole();
			this.layTimer = 0;
		} else {
			this.layTimer++;
		}
	} else {
		var curTile = this.tiles[this.yPos][this.xPos];
		var tileFood = curTile.foodLevel;
		this.diverge();
		this.decide();
		
		if (this.energy > 0) {
			this.energy -= ENERGY_DECAY;
		}
	}
	this.age++;
	this.hunger++;
	this.draw();

}

Ant.prototype.draw = function() {
	if (this.food >= this.maxFood) {
		this.ctx.fillStyle = "#004400";
	} else if (this.food > Math.round(this.maxFood/2)) {
		this.ctx.fillStyle = "#008800";
	} else if (this.food > 0) {
		this.ctx.fillStyle = "#00BB00";
	} else {
		this.ctx.fillStyle = "#00FF00";
	}
	
	this.ctx.fillRect(this.x+Math.round(CELL_SIZE/5), this.y+Math.round(CELL_SIZE/5), Math.round(CELL_SIZE*3/5), Math.round(CELL_SIZE*3/5));
	
	switch(this.dir) {
		case NORTH:
			this.ctx.fillRect(this.x+Math.round(CELL_SIZE*2/5), 
							  this.y-Math.round(CELL_SIZE*2/5), 
							  Math.round(CELL_SIZE/5), 
							  Math.round(CELL_SIZE*3/5));
			break;
		case EAST:
			this.ctx.fillRect(this.x+Math.round(CELL_SIZE*4/5), 
							  this.y+Math.round(CELL_SIZE*2/5), 
							  Math.round(CELL_SIZE*3/5), 
							  Math.round(CELL_SIZE/5));
			break;
		case SOUTH:
			this.ctx.fillRect(this.x+Math.round(CELL_SIZE*2/5), 
							  this.y+Math.round(CELL_SIZE*4/5), 
							  Math.round(CELL_SIZE/5), 
							  Math.round(CELL_SIZE*3/5));
			break;
		case WEST:
			this.ctx.fillRect(this.x-Math.round(CELL_SIZE*2/5), 
							  this.y+Math.round(CELL_SIZE*2/5), 
							  Math.round(CELL_SIZE*3/5), 
							  Math.round(CELL_SIZE/5));
	}
}

Ant.prototype.setNeighbors = function(neighbors) {
	this.neighbors = neighbors;
}

Ant.prototype.turnRight = function() {
	this.dir = this.dir + 1 > 3 ? 0 : this.dir + 1;
	this.consecutiveTurns++;
}

Ant.prototype.turnLeft = function() {
	this.dir = this.dir - 1 < 0 ? 3 : this.dir - 1;	
	this.consecutiveTurns++;
}

Ant.prototype.turnAround = function() {
	this.dir = this.dir + 2 > 3 ? (this.dir + 2) %4 : this.dir + 2;
}

Ant.prototype.move = function() {
	switch (this.dir) {
		case NORTH:
			this.yPos--;
			this.y -= CELL_SIZE;
			break;
		case WEST:
			this.xPos--;
			this.x -= CELL_SIZE;
			break;
		case EAST:
			this.xPos++;
			this.x += CELL_SIZE;
			break;
		case SOUTH:
			this.yPos++;
			this.y += CELL_SIZE;
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
			((this.action === OUTBOUND && peer.action === OUTBOUND) ||
			(this.action === INBOUND && peer.action === INBOUND)) ) {
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
	
	if ((this.hunger > HUNGER_THRESHHOLD || this.energy === 0) && 
		this.action === OUTBOUND) {
		this.energy = 0;
		this.action = INBOUND;
		this.turnAround();
	}
	if (curTile.isHome && this.action === INBOUND) {
		this.mound.foodStorage += this.food;
		//console.log(this.mound.foodStorage);
		if (this.hunger > HUNGER_THRESHHOLD &&
			this.mound.foodStorage < 10) {
			this.die(DEATH_HUNGER);
		} else {
			if (this.hunger > HUNGER_THRESHHOLD) {
				this.eat();
				this.hunger = 0;
				//console.log(this.mound.foodStorage);
			}
			this.chooseRole();
			this.food = 0;
			this.energy = this.maxEnergy;
		}
	}
	if (this.role === EXPLOIT) {
		if (this.food >= this.maxFood && this.action === OUTBOUND) {
			this.action = INBOUND;
			this.energy = this.maxEnergy;
			curTile.inPheromone = this.energy;
			this.turnAround();
		} else if (tileFood > 0 && this.food < this.maxFood) {
			if (tileFood >= FOOD_COLLECT_RATE) {
				if ((this.food + FOOD_COLLECT_RATE) <= this.maxFood) {
					curTile.foodLevel -= FOOD_COLLECT_RATE;
					this.food += FOOD_COLLECT_RATE;
				} else {
					curTile.foodLevel -= this.maxFood - this.food;
					this.food = this.maxFood;
				}
			} else {
				if ((this.food + tileFood) <= this.maxFood) {
					curTile.foodLevel = 0;
					this.food += tileFood;
				} else {
					curTile.foodLevel -= this.maxFood - this.food;
					this.food = this.maxFood;
				}
			}
		} else if (this.action === OUTBOUND) {
			this.decideDir(OUTBOUND);
			this.move();
			curTile.outPheromone = this.energy > curTile.outPheromone ?
								   this.energy : curTile.outPheromone;
		} else if (this.action === INBOUND) { // Going back home
			this.decideDir(INBOUND);
			this.move();
			curTile.inPheromone = this.energy > curTile.inPheromone ?
							      this.energy : curTile.inPheromone;
		}
	} else if (this.role === EXPLORE) {
		if (this.food >= 10 && this.action === OUTBOUND) {
			this.action = INBOUND;
			this.energy = this.maxEnergy;
			curTile.inPheromone = this.energy;
			this.turnAround();
		} else if (tileFood > 0 && this.action === OUTBOUND) {
			curTile.foodLevel--;
			this.food++;
			this.energy = this.maxEnergy;
		} else if (this.action === OUTBOUND) {
			var rand = Math.random();
			if (rand > 0.85) {
				if (rand > 0.925) {
					this.turnRight();
				} else {
					this.turnLeft();
				}
			}
			this.move();
			curTile.outPheromone = this.energy > curTile.outPheromone ?
								   this.energy : curTile.outPheromone;
		} else if (this.action === INBOUND) { // Going back home
			this.decideDir(INBOUND);
			this.move();
			curTile.inPheromone = this.energy > curTile.inPheromone ?
							      this.energy : curTile.inPheromone;
		}
	}
	this.wrapAround();
}

Ant.prototype.wrapAround = function() {
	if (this.yPos <= 0) {
		if (this.dir === NORTH) {
			this.yPos = YSIZE-1;
			this.y = this.yPos * CELL_SIZE;
		}
			
	} else if (this.yPos >= YSIZE-1) {
		if (this.dir === SOUTH) {
			this.yPos = 0;
			this.y = this.yPos * CELL_SIZE;
		}	
	}
	if (this.xPos <= 0) {
		if (this.dir === WEST) {
			this.xPos = XSIZE-1;
			this.x = this.xPos * CELL_SIZE;
		}
	} else if (this.xPos >= XSIZE-1) {
		if (this.dir === EAST) {
			this.xPos = 0;
			this.x = this.xPos * CELL_SIZE;
		}
	}
}

Ant.prototype.decideDir = function(action) {
	var curTile = this.tiles[this.yPos][this.xPos];
	var a = action === INBOUND ? 
	        this.lookAhead().outPheromone :
			this.lookAhead().inPheromone;
	var r = action === INBOUND ? 
	        this.lookRight().outPheromone :
			this.lookRight().inPheromone;
	var l = action === INBOUND ? 
	        this.lookLeft().outPheromone :
			this.lookLeft().inPheromone;
	var max = Math.max(a, r, l);
	
	if (max > 0) {
		if (r === max && this.consecutiveTurns < 3) {
			this.turnRight();
		} else if (l === max && this.consecutiveTurns < 3) {
			this.turnLeft();
		} else {
			this.consecutiveTurns = 0;
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
}

Ant.prototype.eat = function() {
	this.mound.foodStorage -= EAT_AMOUNT;
}

Ant.prototype.eggLay = function() {
	this.mound.spawnLarva(this);
	//console.log("laid");
}

Ant.prototype.eggCare = function() {
	
}

Ant.prototype.die = function(reason) {
	this.mound.removeAnt(this, reason);
}

Ant.prototype.chooseRole = function() {
	// if over threshold for egg laying, lay egg
	if (Math.random() >= this.geneRole && this.mound.canGrow()) {
		this.role = LAY_EGG;
	} else { // forage otherwise
		if (Math.random() >= this.geneForage) {
			this.role = EXPLOIT;
		} else {
			this.role = EXPLORE;
		}
		this.action = OUTBOUND;
		this.turnAround();		
	}	
}