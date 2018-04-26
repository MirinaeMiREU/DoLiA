function Graph(game, mound) {
	this.xSize = 350;
	this.ySize = 175;
	this.ctx = game.ctx;
	this.mound = mound;
	this.antData = [];
	this.larvaData = [];
	this.foodData = [];
	this.antData.push(mound.antCount);
	this.larvaData.push(mound.larvaCount);
	//this.foodData.push(mound.foodStorage);
	this.maxVal = Math.max(this.antData, 
						   this.larvaData);
						   //,
						   //this.foodData); 
	Entity.call(this, game, 810, 0);
}

Graph.prototype.update = function () {
}

Graph.prototype.updatePeriod = function() {
	this.antData.push(this.mound.antCount);
	this.larvaData.push(this.mound.larvaCount);
	this.foodData.push(this.mound.foodStorage);
	this.updateMax();
}

Graph.prototype.draw = function (ctx) {

}

Graph.prototype.drawPeriod = function(ctx) {
	//this.ctx.clearRect(this.x, this.y, this.xSize, this.ySize);
	//this.ctx.moveTo(this.x, this.y+this.ySize);
	if (this.antData.length > 1) {
		this.ctx.strokeStyle = "#00CC00";
		this.ctx.lineWidth = 3;
		//console.log(this.antData[0]);
		//console.log(this.maxVal);
		//console.log(this.x, this.y+this.ySize-Math.floor(this.antData[0]/this.maxVal*this.ySize));
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
			xPos += Math.floor(this.xSize/(length-1));
			yPos = this.y+this.ySize-Math.floor(this.antData[index]/this.maxVal*this.ySize);
			if (yPos <= 0) {
				yPos = 0;
			}
			//console.log(xPos,
				//			this.y+this.ySize-Math.floor(this.antData[i]/this.maxVal*this.ySize));
			if (i === length-1) {
				this.ctx.lineTo(this.x + this.xSize, yPos);
			} else {
				this.ctx.lineTo(xPos, yPos);
			}
		}
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.ctx.strokeStyle = "#000000";
		this.ctx.fillSytle = "#000000";
		this.ctx.fillText(this.antData[this.antData.length-1], this.x+this.xSize+5, yPos+10);
			
		
		
		this.ctx.strokeStyle = "#CCCCCC";
		this.ctx.beginPath();
		xPos = this.x;
		yPos = yPos = this.mound.tick > TICK_DISPLAY ? this.y+this.ySize-Math.floor(this.larvaData[this.mound.tick-TICK_DISPLAY]/this.maxVal*this.ySize)
										   : this.y+this.ySize-Math.floor(this.larvaData[0]/this.maxVal*this.ySize);
		this.ctx.moveTo(xPos, yPos);
		
		for (var i = 1; i < length; i++) {
			var index = this.mound.tick > TICK_DISPLAY ?
						this.mound.tick-TICK_DISPLAY-1+i : i;
			xPos += Math.floor(this.xSize/(length-1));
			yPos = this.y+this.ySize-Math.floor(this.larvaData[index]/this.maxVal*this.ySize);
			
			if (yPos <= 0) {
				yPos = 0;
			}
			//console.log(xPos,
				//			this.y+this.ySize-Math.floor(this.antData[i]/this.maxVal*this.ySize));
			if (i === length-1) {
				this.ctx.lineTo(this.x + this.xSize, yPos);
			} else {
				this.ctx.lineTo(xPos, yPos);
			}
		}
		this.ctx.stroke();
		this.ctx.closePath();
		
		this.ctx.strokeStyle = "#000000";
		this.ctx.fillSytle = "#000000";
		this.ctx.fillText(this.larvaData[this.larvaData.length-1], this.x+this.xSize+5, yPos+10);
		
		var firstTick = 0;
		firstTick = this.mound.tick > TICK_DISPLAY ? this.mound.tick - TICK_DISPLAY : 0;
		this.ctx.fillText(firstTick, this.x, this.y+this.ySize+10);
		this.ctx.textAlign = "right";
		this.ctx.fillText(this.mound.tick-1, this.x+this.xSize-5, this.y+this.ySize+10);
		
		this.ctx.moveTo(this.x, this.y+this.ySize);
		for (var i = 1; i < this.larvaData.length; i++) {
			//this.ctx.lineTo();
		}
	}
	this.ctx.strokeStyle = "#000000";
	this.ctx.lineWidth = 1;
	this.ctx.strokeRect(this.x, this.y, this.xSize, this.ySize);
}

Graph.prototype.updateMax = function() {
	var tick = this.mound.tick;
	if (tick > TICK_DISPLAY) {
		var recentMax = this.antData[tick-TICK_DISPLAY] >= this.larvaData[tick-TICK_DISPLAY] ?
						this.antData[tick-TICK_DISPLAY] : this.larvaData[tick-TICK_DISPLAY];
		for (var i = this.mound.tick-TICK_DISPLAY; i <= this.mound.tick; i++) {
			var biggerVal = this.antData[i] >= this.larvaData[i] ? 
							this.antData[i] : this.larvaData[i];
			recentMax = biggerVal > recentMax ?
						biggerVal : recentMax;
		}
		this.maxVal = recentMax;
	} else {
		this.maxVal = Math.max(...this.antData, 
							   ...this.larvaData);
	}
						   //,
						   //...this.foodData);
}