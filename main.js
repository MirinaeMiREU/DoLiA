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
	
	for (var i = 0; i < 60; i++) {
		squares.push([]);
		for (var j = 0; j < 80; j++) {
			squares[i].push(new Tile(gameEngine, j, i));
		}
	}
	
	/*
	for (var i = 0; i < 60; i++) {
		for (var j = 0; j < 80; j++) {
			
			if ((i < 40 && i > 20) && (j > 25 && j < 55)) {
				squares[i][j].foodLevel = 0;
			}
		}
	}
	*/
	
	for (var i = 0; i < 60; i++) {
		for (var j = 0; j < 80; j++) {
			console.log(i + ", " + j);
			gameEngine.addEntity(squares[i][j]);
		}
	}
	
	for (var i = 0; i < 60; i++) {
		for (var j = 0; j < 80; j++) {
			var neighbors = [];
			if (i === 0) {
				if (j === 0) {
					neighbors.push(squares[i+1][j]);
					neighbors.push(squares[i][j+1]);
				} else if (j === 79) {
					neighbors.push(squares[i+1][j]);
					neighbors.push(squares[i][j-1]);
				} else {
					neighbors.push(squares[i+1][j]);
					neighbors.push(squares[i][j+1]);
					neighbors.push(squares[i][j-1]);
				}
			} else if (i === 59) {
				if (j === 0) {
					neighbors.push(squares[i-1][j]);
					neighbors.push(squares[i][j+1]);
				} else if (j === 79) {
					neighbors.push(squares[i-1][j]);
					neighbors.push(squares[i][j-1]);
				} else {
					neighbors.push(squares[i-1][j]);
					neighbors.push(squares[i][j+1]);
					neighbors.push(squares[i][j-1]);
				}
			} else if (j === 0) {
				neighbors.push(squares[i-1][j]);
				neighbors.push(squares[i][j+1]);
				neighbors.push(squares[i+1][j]);
			} else if (j === 79) {
				neighbors.push(squares[i-1][j]);
				neighbors.push(squares[i][j-1]);
				neighbors.push(squares[i+1][j]);
			} else {
				neighbors.push(squares[i-1][j]);
				neighbors.push(squares[i][j-1]);
				neighbors.push(squares[i][j+1]);
				neighbors.push(squares[i+1][j]);
			}
			squares[i][j].setNeighbors(neighbors);
		}
	}
	squares[29][39].setHome().setTiles(squares);
	
	gameEngine.start();
	
    console.log("All Done!");
});