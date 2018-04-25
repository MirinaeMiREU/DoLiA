function Graph(game, mound) {
	this.ctx = game.ctx;
	this.mound = mound;
	this.antData = [0];
	this.larvaData = [0];
	this.foodData = [0];
	Entity.call(this, game, 800, 0);
}

Graph.prototype.update = function () {
}

Graph.prototype.updatePeriod = function() {
	this.antData.push(this.mound.antCount);
	this.larvaData.push(this.mound.larvaCount);
}

Graph.prototype.draw = function (ctx) {
	this.ctx.strokeRect(this.x, this.y, 400, 200);
}