function Larva(game, mound) {
	this.game = game;
	this.ctx = game.ctx;
	this.mound = mound;
	this.mound.foodStorage -= EAT_AMOUNT;
	this.age = 0;
	Entity.call(this, game, 0, 0);
}

Larva.prototype = new Entity();
Larva.prototype.constructor = Larva;

Larva.prototype.update = function() {
	if (this.age >= MATURE_TIME) {
		if (this.mound.foodStorage >= EAT_AMOUNT) {
			this.mound.spawnAnt();
			this.mound.foodStorage -= EAT_AMOUNT;
		}
		this.mound.removeLarva(this);
	}
	this.age++;
}

Larva.prototype.draw = function() {
}