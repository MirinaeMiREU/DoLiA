var socket = io.connect("http://24.16.255.56:8888");
socket.on("connect", function() {
    console.log("connected on output");
});
/*
socket.emit("loadAnts", {"params.run": "Run#1"});
socket.on("loadAnts", function(e) {
    console.log(e);
});
*/