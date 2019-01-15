AM = new AssetManager();

AM.queueDownload("./img/knight/IDLE.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");	
    var gameEngine = new GameEngine();
	
	// main
	CELL_SIZE = parseInt(document.getElementById("cellSize").value);
	XSIZE = Math.floor(800/CELL_SIZE);
	YSIZE = Math.floor(600/CELL_SIZE);
	
    gameEngine.init(ctx);
	gameEngine.start();
	
    console.log("All Done!");
});