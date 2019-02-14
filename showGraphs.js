var socket = io.connect("https://24.16.255.56:8888");
var context;

socket.on("connect", function() {
    console.log("connected on output");
});

document.addEventListener("DOMContentLoaded", function(event) { 

    context = document.getElementById("chart").getContext("2d");
    context.fillStyle = "#eeeeee";
    context.fillRect(0, 0, 1000, 400);
    context.fillRect(0, 450, 1000, 400);
    context.fillRect(0, 900, 1000, 400);
    context.fillRect(0, 1350, 1000, 400);
    context.fillRect(0, 1800, 1000, 400);

    document.getElementById("queryButton").addEventListener("click", function (e) {
        var query = document.getElementById("runToQuery").value;
        if (query !== "" && query !== null) {
                socket.emit("loadAnts", {run: query, mode: "explore"});
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
    var arrAnt = [];
    var arrFood = [];
    var arrLarva = [];
    var arrFoodPeriod = [];
    var arrLarvaPeriod = [];

    for (var i = 0; i < 2000; i++) {
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
            arrAnt[j] += data[i].ants[j]/data.length;
            arrFood[j] += data[i].food[j]/data.length;
            arrLarva[j] += data[i].larva[j]/data.length;
            arrFoodPeriod[j] += data[i].foragePeriod[j]/data.length;
            arrLarvaPeriod[j] += data[i].larvaPeriod[j]/data.length;
        }
    }

    for (var i = 0; i < arrAnt.length; i++) {
        if (arrAnt[i] > maxAnt) {
            maxAnt = arrAnt[i];
        }
        if (arrFood[i] > maxFood) {
            maxFood = arrFood[i];
        }
        if (arrLarva[i] > maxLarva) {
            maxLarva = arrLarva[i];
        }
        if (arrFoodPeriod[i] > maxFoodPeriod) {
            maxFoodPeriod = arrFoodPeriod[i];
        }
        if (arrLarvaPeriod[i] > maxLarvaPeriod) {
            maxLarvaPeriod = arrLarvaPeriod[i];
        }
    }
    
    var histogramRole = [];
    var histogramForage = [];

    for (var i = 0; i < 2000; i++) {
        var slice = [];
        var slice2 = [];
        for (var j = 0; j < 20; j++) {
            slice.push(0);
            slice2.push(0);
        }
        histogramRole.push(slice);
        histogramForage.push(slice2);
    }
   
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < 2000; j++) {
            for (var k = 0; k < 20; k++) {
                if (data[i].roleHistogram[j] !== undefined && data[i].forageHistogram[j] !== undefined) {
                    histogramRole[j][k] += data[i].roleHistogram[j][k]/data[i].ants[j]/data.length;
                    histogramForage[j][k] += data[i].forageHistogram[j][k]/data[i].ants[j]/data.length;
                }            
            }
        }
    }

    var obj = {
        ant: arrAnt,
        food: arrFood,
        larva: arrLarva,
        foodPeriod: arrFoodPeriod,
        larvaPeriod: arrLarvaPeriod,
        maxAnt: maxAnt,
        maxFood: maxFood,
        maxLarva: maxLarva,
        maxFoodPeriod: maxFoodPeriod,
        maxLarvaPeriod: maxLarvaPeriod,
        histogramRole: histogramRole,
        histogramForage: histogramForage
    };
    
    console.log(data);
    drawData(obj, context);
}

function drawData(obj, ctx) {
    ctx.clearRect(0, 0, 1400, 3200);
    ctx.textAlign = "start";
    var maxAnt = obj.maxAnt + obj.maxAnt * 0.05;
    var maxFood = obj.maxFood + obj.maxFood * 0.05;
    var maxLarva = obj.maxLarva + obj.maxLarva * 0.05;
    var maxFoodPeriod = obj.maxFoodPeriod + obj.maxFoodPeriod * 0.05;
    var maxLarvaPeriod = obj.maxLarvaPeriod + obj.maxLarvaPeriod * 0.05;

    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(0, 0, 1000, 400);
    ctx.fillRect(0, 450, 1000, 400);
    ctx.fillRect(0, 900, 1000, 400);
    ctx.fillRect(0, 1350, 1000, 400);
    ctx.fillRect(0, 1800, 1000, 400);
    ctx.fillRect(0, 2250, 1000, 400);
    ctx.fillRect(0, 2700, 1000, 400);

    var antColor = "#000000";

    var initAnt = 0;
    var initFood = 450;
    var initLarva = 900;
    var initFoodPeriod = 1350;
    var initLarvaPeriod = 1800;
    var initHistogramRole = 2250;
    var initHistogramForage = 2700;

    drawGraph(ctx, antColor, initAnt, obj.ant, maxAnt);
    drawGraph(ctx, antColor, initFood, obj.food, maxFood);
    drawGraph(ctx, antColor, initLarva, obj.larva, maxLarva);
    drawGraph(ctx, antColor, initFoodPeriod, obj.foodPeriod, maxFoodPeriod);
    drawGraph(ctx, antColor, initLarvaPeriod, obj.larvaPeriod, maxLarvaPeriod);
    drawHistogram(ctx, initHistogramRole, obj.histogramRole);
    drawHistogram(ctx, initHistogramForage, obj.histogramForage);
    label(ctx);
}

function drawGraph(ctx, color, start, obj, maxVal) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    var initAnt = 400 + start - Math.floor(obj[0]/maxVal*400);
    ctx.moveTo(0,initAnt);
    for (var i = 2; i < obj.length; i += 2) {
        var yPos = 400 + start - Math.floor(obj[i]/maxVal*400);
        ctx.lineTo(i/2, yPos);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "#000000";
    ctx.fillText(Math.ceil(maxVal), 1010, start+10);
    ctx.fillText(Math.ceil(3*maxVal/4), 1010, start+110);
    ctx.fillText(Math.ceil(2*maxVal/4), 1010, start+210);
    ctx.fillText(Math.ceil(maxVal/4), 1010, start+310);
    ctx.fillText(1000, 500, start+410);
    ctx.fillText(2000, 1000, start+410);
}

function drawHistogram(ctx, start, obj) {
    for (var i = 0; i < 2000; i += 2) {
        for (var j = 0; j < 20; j++) {
            var val = Math.ceil(obj[i/2][j] * 20);
            fill(ctx, val, start, i/2, 19-j);
        }
    }
}

function fill(ctx, color, start, x, y) {
    switch(color) {
		case 0:
			ctx.fillStyle = "#FFFFFF";
			break;
		case 1:
			ctx.fillStyle = "#F0F0F0";
			break;
		case 2:
			ctx.fillStyle = "#E4E4E4";
			break;
		case 3:
			ctx.fillStyle = "#D8D8D8";
			break;
		case 4:
			ctx.fillStyle = "#CCCCCC";
			break;
		case 5:
			ctx.fillStyle = "#C0C0C0";
			break;
		case 6:
			ctx.fillStyle = "#B4B4B4";
			break;
		case 7:
			ctx.fillStyle = "#A8A8A8";
			break;
		case 8:
			ctx.fillStyle = "#9C9C9C";
			break;
		case 9:
			ctx.fillStyle = "#909090";
			break;
		case 10:
			ctx.fillStyle = "#848484";
			break;
		case 11:
			ctx.fillStyle = "#787878";
			break;
		case 12:
			ctx.fillStyle = "#6C6C6C";
			break;
		case 13:
			ctx.fillStyle = "#606060";
			break;
		case 14:
			ctx.fillStyle = "#545454";
			break;
		case 15:
			ctx.fillStyle = "#484848";
			break;
		case 16:
			ctx.fillStyle = "#3C3C3C";
			break;
		case 17:
			ctx.fillStyle = "#303030";
			break;
		case 18:
			ctx.fillStyle = "#242424";
			break;
		case 19:
			ctx.fillStyle = "#181818";
			break;
		case 20:
			ctx.fillStyle = "#0C0C0C";
			break;
	}
	var width = 1;
	var height = 20;
	ctx.fillRect(x*width, 
		            start+(y*height),
				    width,
					height);
}

function label(ctx) {
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Ants", 500, 430);
    ctx.fillText("Food", 500, 880);
    ctx.fillText("Larvae", 500, 1330);
    ctx.fillText("Food per Period", 500, 1780);
    ctx.fillText("Larvae per Period", 500, 2230);
    ctx.fillText("Breeder vs Forager", 500, 2680);
    ctx.fillText("Exploiter vs Explorer", 500, 3130);
}