var AM = new AssetManager();

AM.queueDownload("./img/knight/IDLE.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

	var playButton = document.getElementById("play");
	var pauseButton = document.getElementById("pause");
	var stepButton = document.getElementById("step");
	
    var gameEngine = new GameEngine();
    gameEngine.init(ctx, playButton, pauseButton, stepButton);
    
	var squares = [];
	
	for (var i = 0; i < YSIZE; i++) {
		squares.push([]);
		for (var j = 0; j < XSIZE; j++) {
			var tile = new Tile(gameEngine, j, i);
			squares[i].push(tile);
			gameEngine.addEntity(tile);
		}
	}
	/*
	for (var i = 0; i < 60; i++) {
		for (var j = 0; j < 80; j++) {
			
			if ((i < 45 && i > 15) && (j > 20 && j < 60)) {
				squares[i][j].foodLevel = 0;
			}
		}
	}
	*/
	
	for (var i = 0; i < YSIZE; i++) {
		for (var j = 0; j < XSIZE; j++) {
			var neighbors = [];
			if (i === 0) {
				neighbors.push(squares[YSIZE-1][j]);
				if (j === 0) {
					neighbors.push(squares[i][j+1]);
					neighbors.push(squares[i+1][j]);
					neighbors.push(squares[i][XSIZE-1]);
				} else if (j === XSIZE-1) {
					neighbors.push(squares[i][0]);
					neighbors.push(squares[i+1][j]);
					neighbors.push(squares[i][j-1]);
				} else {
					neighbors.push(squares[i][j+1]);
					neighbors.push(squares[i+1][j]);
					neighbors.push(squares[i][j-1]);
				}
			} else if (i === YSIZE-1) {
				neighbors.push(squares[i-1][j]);
				if (j === 0) {
					neighbors.push(squares[i][j+1]);
					neighbors.push(squares[0][j]);
					neighbors.push(squares[i][XSIZE-1]);
				} else if (j === XSIZE-1) {
					neighbors.push(squares[i][0]);
					neighbors.push(squares[0][j]);
					neighbors.push(squares[i][j-1]);
				} else {
					neighbors.push(squares[i][j+1]);
					neighbors.push(squares[0][j]);
					neighbors.push(squares[i][j-1]);
				}
			} else if (j === 0) {
				neighbors.push(squares[i-1][j]);
				neighbors.push(squares[i][j+1]);
				neighbors.push(squares[i+1][j]);
				neighbors.push(squares[i][XSIZE-1]);
			} else if (j === XSIZE-1) {
				neighbors.push(squares[i-1][j]);
				neighbors.push(squares[i][0]);
				neighbors.push(squares[i+1][j]);
				neighbors.push(squares[i][j-1]);
			} else {
				neighbors.push(squares[i-1][j]);
				neighbors.push(squares[i][j+1]);
				neighbors.push(squares[i+1][j]);
				neighbors.push(squares[i][j-1]);
			}
			squares[i][j].setNeighbors(neighbors);
		}
	}
	squares[Math.round(YSIZE/2)-1][Math.round(XSIZE/2)-1].setHome().setTiles(squares);
	
	gameEngine.start();
	
    console.log("All Done!");
});