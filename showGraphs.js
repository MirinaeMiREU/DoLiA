
socket.emit("loadAnts", {mode: "test"});
socket.on("loadAnts", function(e) {
    console.log(e);
});