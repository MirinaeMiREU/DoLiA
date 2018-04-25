function Histogram(game, mound, x, y) {
	this.xSize = 350;
	this.ySize = 180;
	this.ctx = game.ctx;
	this.mound = mound;
	Entity.call(this, game, x, y);
}

Histogram.prototype.update = function () {
}

Histogram.prototype.updatePeriod = function() {
}

Histogram.prototype.draw = function (ctx) {
}

Histogram.prototype.drawPeriod = function() {
	this.ctx.strokeStyle = "#000000";
	this.ctx.lineWidth = 1;
	this.ctx.strokeRect(this.x, this.y, this.xSize, this.ySize);
}

Histogram.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}