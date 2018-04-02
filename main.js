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
	
	for (var i = -1; i < 61; i++) {
		squares.push([]);
		for (var j = -1; j < 81; j++) {
			squares[i+1].push(new Tile(gameEngine, j+1, i, false));
		}
	}
	
	for (var i = 0; i < 62; i++) {
		for (var j = 0; j < 82; j++) {
			if (i === 30 && j === 40) {
				squares[i][j].isHome = true;
			}
			if (i === 0 || i === 61 ) {
				squares[i][j].foodLevel = 0;
			}
			if (j === 0 || j === 81) {
				squares[i][j].foodLevel = 0;
			}
			
			if ((i < 45 && i > 15) && (j > 20 && j < 60)) {
				squares[i][j].foodLevel = 0;
			}
		}
	}
	
	for (var i = 1; i < 61; i++) {
		for (var j = 1; j < 81; j++) {
			console.log(i + ", " + j);
			gameEngine.addEntity(squares[i][j]);
		}
	}
	
	for (var i = 1; i < 61; i++) {
		for (var j = 1; j < 81; j++) {
			var neighbors =  [];
			neighbors.push(squares[i-1][j]);
			neighbors.push(squares[i][j-1]);
			neighbors.push(squares[i][j+1]);
			neighbors.push(squares[i+1][j]);
			squares[i][j].setNeighbors(neighbors);
		}
	}

	gameEngine.start();
	
    console.log("All Done!");
});