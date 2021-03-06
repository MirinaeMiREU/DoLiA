function Graph(game, mound) {
	this.xSize = 360;
	this.ySize = 175;
	this.ctx = game.ctx;
	this.mound = mound;
	this.antData = [];
	this.larvaData = [];
	this.foodData = [];
//	this.antData.push(mound.antCount);
//	this.larvaData.push(mound.larvaCount);
//	this.foodData.push(Math.floor(mound.foodStorage/EAT_AMOUNT));
	this.maxVal = Math.max(this.antData, 
						   this.larvaData,
						   this.foodData); 
	Entity.call(this, game, 810, 0);
}

Graph.prototype.update = function () {
}

Graph.prototype.updatePeriod = function() {
	this.antData.push(this.mound.antCount);
	this.larvaData.push(this.mound.larvaCount);
	this.foodData.push(Math.floor(this.mound.foodStorage/EAT_AMOUNT));
	this.updateMax();
}

Graph.prototype.draw = function (ctx) {

}

Graph.prototype.drawPeriod = function(ctx) {

	if (this.antData.length > 1) {
		//ant
		this.ctx.strokeStyle = "#00BB00";
		this.ctx.lineWidth = 2;

		this.ctx.beginPath();
		var xPos = this.x;
		var yPos = this.mound.tick > TICK_DISPLAY ? this.y+this.ySize-Math.floor(this.antData[this.mound.tick-TICK_DISPLAY]/this.maxVal*this.ySize)
										: this.y+this.ySize-Math.floor(this.antData[0]/this.maxVal*this.ySize);
		this.ctx.moveTo(xPos, yPos);
		var length = this.mound.tick > TICK_DISPLAY ?
					 TICK_DISPLAY : this.antData.length;
		for (var i = 1; i < length; i++) {
			var index = this.mound.tick > TICK_DISPLAY ?
						this.mound.tick-TICK_DISPLAY-1+i : i;
			xPos++;
			yPos = this.y+this.ySize-Math.floor(this.antData[index]/this.maxVal*this.ySize);
			if (yPos <= 0) {
				yPos = 0;
			}
			
			this.ctx.lineTo(xPos, yPos);
		}
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.ctx.strokeStyle = "#000000";
		this.ctx.fillSytle = "#000000";
		this.ctx.fillText(this.antData[this.antData.length-1], this.x+this.xSize+5, yPos+10);
			
		//larva
		this.ctx.strokeStyle = "#CCCCCC";
		this.ctx.beginPath();
		xPos = this.x;
		yPos = yPos = this.mound.tick > TICK_DISPLAY ? this.y+this.ySize-Math.floor(this.larvaData[this.mound.tick-TICK_DISPLAY]/this.maxVal*this.ySize)
										   : this.y+this.ySize-Math.floor(this.larvaData[0]/this.maxVal*this.ySize);
		this.ctx.moveTo(xPos, yPos);
		
		for (var i = 1; i < length; i++) {
			var index = this.mound.tick > TICK_DISPLAY ?
						this.mound.tick-TICK_DISPLAY-1+i : i;
			xPos++;
			yPos = this.y+this.ySize-Math.floor(this.larvaData[index]/this.maxVal*this.ySize);
			
			if (yPos <= 0) {
				yPos = 0;
			}
			
			this.ctx.lineTo(xPos, yPos);
		}
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.ctx.strokeStyle = "#000000";
		this.ctx.fillSytle = "#000000";
		this.ctx.fillText(this.larvaData[this.larvaData.length-1], this.x+this.xSize+5, yPos+10);
		
		//food
		this.ctx.strokeStyle = "#000000";

		this.ctx.beginPath();
		var xPos = this.x;
		var yPos = this.mound.tick > TICK_DISPLAY ? this.y+this.ySize-Math.floor(this.foodData[this.mound.tick-TICK_DISPLAY]/this.maxVal*this.ySize)
										: this.y+this.ySize-Math.floor(this.foodData[0]/this.maxVal*this.ySize);
		this.ctx.moveTo(xPos, yPos);
		var length = this.mound.tick > TICK_DISPLAY ?
					 TICK_DISPLAY : this.foodData.length;
		for (var i = 1; i < length; i++) {
			var index = this.mound.tick > TICK_DISPLAY ?
						this.mound.tick-TICK_DISPLAY-1+i : i;
			xPos++;
			yPos = this.y+this.ySize-Math.floor(this.foodData[index]/this.maxVal*this.ySize);
			if (yPos <= 0) {
				yPos = 0;
			}
			
			this.ctx.lineTo(xPos, yPos);
		}
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.ctx.strokeStyle = "#000000";
		this.ctx.fillSytle = "#000000";
		this.ctx.fillText(this.foodData[this.foodData.length-1], this.x+this.xSize+5, yPos+10);
		
		var firstTick = 0;
		firstTick = this.mound.tick > TICK_DISPLAY ? this.mound.tick - TICK_DISPLAY : 0;
		this.ctx.fillText(firstTick, this.x, this.y+this.ySize+10);
		this.ctx.textAlign = "right";
		this.ctx.fillText(this.mound.tick-1, this.x+this.xSize-5, this.y+this.ySize+10);
	}
	this.ctx.strokeStyle = "#000000";
	this.ctx.lineWidth = 1;
	this.ctx.strokeRect(this.x, this.y, this.xSize, this.ySize);
	
}

Graph.prototype.updateMax = function() {
	var tick = this.mound.tick;
	if (tick > TICK_DISPLAY) {
		var recentAnt = this.antData.slice(tick-TICK_DISPLAY);
		var recentLarva = this.larvaData.slice(tick-TICK_DISPLAY);
		var recentFood = this.foodData.slice(tick-TICK_DISPLAY);
		
		this.maxVal = Math.max(...recentAnt,
		                       ...recentLarva,
							   ...recentFood);
	} else {
		this.maxVal = Math.max(...this.antData, 
							   ...this.larvaData,
							   ...this.foodData);
	}
}