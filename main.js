var AM = new AssetManager();

AM.queueDownload("./img/knight/IDLE.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");	
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
	gameEngine.start();
	
    console.log("All Done!");
});