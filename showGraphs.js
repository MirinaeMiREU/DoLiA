var socket = io.connect("http://24.16.255.56:8888");
socket.on("connect", function() {
    console.log("connected on output");
});

document.addEventListener("DOMContentLoaded", function(event) { 
    document.getElementById("queryButton").addEventListener("click", function (e) {
        var query = document.getElementById("runToQuery").value;
        if (query !== "" && query !== null) {
                socket.emit("loadAnts", {run: query});
        } else {
            console.log("Query Empty");
        }
    }, false);
});

socket.on("loadAnts", function(e) {
    var finishedOnlyToggle = document.getElementById("finishedOnlyToggle").checked;
    var array = e.slice(0,100);
    var completed = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].ants.length >= 1999) {
            completed.push(array[i]);
        }
    }
    
    
    if (finishedOnlyToggle) {
        parseData(completed);
    } else {
        parseData(array);
    }
});

function parseData(data) {
    var ctx = document.getElementById("chart").getContext("2d");	
    var arrAnt = [];
    var arrFood = [];
    var arrLarva = [];
    var arrFoodPeriod = [];
    var arrLarvaPeriod = [];
    for (var i = 0; i < data[0].ants.length; i++) {
        arrAnt.push(0);
        arrFood.push(0);
        arrLarva.push(0);
        arrFoodPeriod.push(0);
        arrLarvaPeriod.push(0);
    }
    var maxAnt = 0;
    var maxFood = 0;
    var maxLarva = 0;
    var maxFoodPeriod = 0;
    var maxLarvaPeriod = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].ants.length; j++) {
            if (data[i].ants[j] > maxAnt) {
                maxAnt = data[i].ants[j];
            }
            arrAnt[j] += data[i].ants[j];
        }
        for (var j = 0; j < data[i].ants.length; j++) {
            if (data[i].food[j] > maxFood) {
                maxFood = data[i].food[j];
            }
            arrFood[j] += data[i].food[j];
        }
        for (var j = 0; j < data[i].ants.length; j++) {
            if (data[i].larva[j] > maxLarva) {
                maxLarva = data[i].larva[j];
            }
            arrLarva[j] += data[i].larva[j];
        }
        for (var j = 0; j < data[i].ants.length; j++) {
            if (data[i].foragePeriod[j] > maxFoodPeriod) {
                maxFoodPeriod = data[i].foragePeriod[j];
            }
            arrFoodPeriod[j] += data[i].foragePeriod[j];
        }
        for (var j = 0; j < data[i].ants.length; j++) {
            if (data[i].larvaPeriod[j] > maxLarvaPeriod) {
                maxLarvaPeriod = data[i].larvaPeriod[j];
            }
            arrLarvaPeriod[j] += data[i].larvaPeriod[j];
        }
    }
    
    for (var i = 0; i < arrAnt.length; i++) {
        arrAnt[i] /= data.length;
        arrFood[i] /= data.length;
        arrLarva[i] /= data.length;
        arrFoodPeriod[i] /= data.length;
        arrLarvaPeriod[i] /= data.length;
    }
    
    console.log(data);
    console.log("Ant");
    console.log(arrAnt);
    console.log("Food");
    console.log(arrFood);
    console.log("Larva");
    console.log(arrLarva);
    console.log("Food Period");
    console.log(arrFoodPeriod);
    console.log("Larva Period");
    console.log(arrLarvaPeriod);
}
/*
socket.emit("loadAnts", {run: "Run#1"});
socket.on("loadAnts", function(e) {
    console.log(e);
});
*/