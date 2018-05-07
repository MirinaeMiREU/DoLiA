function Larva(game, mound, parent) {
	this.game = game;
	this.ctx = game.ctx;
	this.mound = mound;
	this.alive = true;
	this.parent = parent;
	if (this.mound.foodStorage >= EAT_AMOUNT) {
		this.mound.foodStorage -= EAT_AMOUNT;
	} else {
		this.alive = false;
	}
	this.age = 0;
	Entity.call(this, game, 0, 0);
}

Larva.prototype = new Entity();
Larva.prototype.constructor = Larva;

Larva.prototype.update = function() {
	if (!this.alive) {
		this.mound.removeLarva(this);
	}	
	if (this.age >= MATURE_TIME) {
		if (this.mound.foodStorage >= EAT_AMOUNT) {
			this.mound.foodStorage -= EAT_AMOUNT;
			this.mound.spawnAnt();
			this.parent.totalOffspring++;
		}
		this.mound.removeLarva(this);
	}
	this.age++;
}

Larva.prototype.draw = function() {
}