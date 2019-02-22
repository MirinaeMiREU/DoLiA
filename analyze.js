//
function DataGraph(game, data) {
    this.pending = true;
    Entity.call(this, game, 0, 0);
}

DataGraph.prototype.update = function (data) {
    //game engine says to do something
}

DataGraph.prototype.draw = function (ctx) {
    if(this.pending) {
        //show loading
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(0, 0, 1200, 800);

        ctx.font="20px Sans-Serif";
        ctx.fillStyle = "Black";
        ctx.fillText("LOADING...", 550, 400);
    } else if(this.data) {
        //draw graphs
        var startX = 0;
        var startY = 25;
        var gHeight = 200;
        var gWidth = 1150;

        //pop graph
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(startX, startY, gWidth, gHeight);
        graph(ctx, this.data.popCount, this.data.popCountMax, this.data.days, startX, startY, gWidth, gHeight, "blue", "", true);
        labelGraph(ctx, this.data.popCountMax, this.data.days, startX, startY, gWidth, gHeight, "Population Count By Generation:")

        //sharePercent graph
        var startY = 265;
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(startX, startY, gWidth, gHeight);
        graph(ctx, this.data.sharePercMin, this.data.sharePercMaxMax, this.data.days, startX, startY, gWidth, gHeight, "lightgreen");
        graph(ctx, this.data.sharePercMax, this.data.sharePercMaxMax, this.data.days, startX, startY, gWidth, gHeight, "lightgreen");
        graph(ctx, this.data.sharePercMed, this.data.sharePercMaxMax, this.data.days, startX, startY, gWidth, gHeight, "red");
        graph(ctx, this.data.sharePercStdUpper, this.data.sharePercMaxMax, this.data.days, startX, startY, gWidth, gHeight, "green");
        graph(ctx, this.data.sharePercStdLower, this.data.sharePercMaxMax, this.data.days, startX, startY, gWidth, gHeight, "green");
        graph(ctx, this.data.sharePercAvg, this.data.sharePercMaxMax, this.data.days, startX, startY, gWidth, gHeight, "black");
        labelGraph(ctx, this.data.sharePercMaxMax, this.data.days, startX, startY, gWidth, gHeight, "Share Percent By Generation:")

        //breed/share graph
        var startY = 505;
        var gHeight = 100;
        var shareBreedMax = Math.max(this.data.breedAvgMax, this.data.shareAvgMax);
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(startX, startY, gWidth, gHeight);
        graph(ctx, this.data.shareAvg, shareBreedMax, this.data.days, startX, startY, gWidth, gHeight, "blue");
        graph(ctx, this.data.breedAvg, shareBreedMax, this.data.days, startX, startY, gWidth, gHeight, "red");
        labelGraph(ctx, shareBreedMax, this.data.days, startX, startY, gWidth, gHeight, "Share Avg (BLUE) and Breed Avg (RED) By Generation:")

        //pop vs share graph
        startY = 645;
        gHeight = 300;
        gWidth = 575;
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(startX, startY, gWidth, gHeight);
        graph(ctx, this.data.popShareAvg, this.data.sharePercMaxMax, this.data.popCountMax, startX, startY, gWidth, gHeight, "darkblue");
        graph(ctx, this.data.popShareMin, this.data.sharePercMaxMax, this.data.popCountMax, startX, startY, gWidth, gHeight, "lightblue");
        graph(ctx, this.data.popShareMax, this.data.sharePercMaxMax, this.data.popCountMax, startX, startY, gWidth, gHeight, "lightblue");
        graph(ctx, this.data.popShareStdUpper, this.data.sharePercMaxMax, this.data.popCountMax, startX, startY, gWidth, gHeight, "blue");
        graph(ctx, this.data.popShareStdLower, this.data.sharePercMaxMax, this.data.popCountMax, startX, startY, gWidth, gHeight, "blue");
        labelGraph(ctx, this.data.sharePercMaxMax, this.data.popCountMax, startX, startY, gWidth, gHeight, "Share Percent by Population Count:")

        //text info
        startX = 625;
        ctx.font="12px monospace";
        ctx.fillStyle = "Black";
        ctx.fillText(this.data.popIds.length + " Runs queried (only successful runs are graphed)", startX, startY + 10);
        var successPerc = ((this.data.successCount / this.data.popIds.length) * 100).toFixed(2);
        ctx.fillText("Successful Runs: " + this.data.successCount + "/" + this.data.popIds.length + " (" + successPerc + "%)", startX, startY + 25);
        ctx.fillText("IDs: " + this.data.popIds.join(", "), startX, startY + 40);

        //draw mouse drawCursor to compare graphs
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(this.cursorX, 0, 1, 1200);

    } else {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 1200, 800);
    }
}

function DataManager(graphs) {
    this.graphs = graphs;
    this.data;
    this.successUndef = false;
}

DataManager.prototype.import = function (dataArr) {
    //merge runs
    var data = {
        dataGroup: [],
        params: [],
        popIds: [],
        days: 0,
        popCountMax: 0,
        popCount: [],
        popShare: [],
        breedAvg: [],
        shareAvg: [],
        sharePercAvg: [],
        sharePercMax: [],
        sharePercMed: [],
        sharePercMin: [],
        sharePercStd: [],
        sharePercStdUpper: [],
        sharePercStdLower: [],
        breedAvgMax: 0,
        shareAvgMax: 0,
        sharePercMaxMax: 0,
        successCount: 0
    };

    var maxDays = 0;
    for(var i = 0; i < dataArr.length; i++) {
        if(dataArr[i].sharePercentsAvg.length > maxDays) {
            maxDays = dataArr[i].sharePercentsAvg.length;
        }
        data.popIds.push(dataArr[i].popId);
        data.params.push(dataArr[i].params);
    }
    data.days = maxDays;

    //only graph successful arrays
    var successUndef = this.successUndef;
    var successArr = dataArr.filter((obj) => {
        return obj.successful || (obj.successful == undefined && successUndef);
    })
    data.successCount = successArr.length;

    //average all the arrays
    for (var i = 0; i < maxDays; i++) {
        var count = 0;
        var pop = 0;
        var bAvg = 0;
        var sAvg = 0;
        var spAvg = 0;
        var spMax = 0;
        var spMin = 0;
        var spMed = 0;
        var spStd = 0;

        for(var k = 0; k < successArr.length; k++) {
            if(i < successArr[k].breedAvg.length) {
                if(successArr[k].popCount) pop += successArr[k].popCount[i];
                bAvg += successArr[k].breedAvg[i];
                sAvg += successArr[k].shareAvg[i];
                spAvg += successArr[k].sharePercentsAvg[i];
                spMin += successArr[k].sharePercentsMin[i];
                spMax += successArr[k].sharePercentsMax[i];
                spMed += successArr[k].sharePercentsMed[i];
                spStd += successArr[k].sharePercentsStd[i];
                count++;
            }
        }

        //TODO use count or num arrs
        data.popCount.push(pop/count);
        data.breedAvg.push(bAvg/count);
        data.shareAvg.push(sAvg/count);
        data.sharePercAvg.push(spAvg/count);
        data.sharePercMin.push(spMin/count);
        data.sharePercMax.push(spMax/count);
        data.sharePercMed.push(spMed/count);
        data.sharePercStd.push(spStd/count);
        data.sharePercStdUpper.push(data.sharePercAvg[i] + data.sharePercStd[i]);
        data.sharePercStdLower.push(Math.max(data.sharePercAvg[i] - data.sharePercStd[i], 0));

        //get the biggest val for graphing bounds
        data.popCountMax = Math.ceil(Math.max(data.popCountMax, data.popCount[i]));
        data.breedAvgMax = Math.max(data.breedAvgMax, data.breedAvg[i]);
        data.shareAvgMax = Math.max(data.shareAvgMax, data.shareAvg[i]);
        data.sharePercMaxMax = Math.max(data.sharePercMaxMax, data.sharePercMax[i]);
    }

    //calculate pop/share relationship
    data.popShareAvg = this.avgRelate(data.popCount, data.sharePercAvg, data.popCountMax);
    data.popShareMin = this.avgRelate(data.popCount, data.sharePercMin, data.popCountMax);
    data.popShareMax = this.avgRelate(data.popCount, data.sharePercMax, data.popCountMax);
    data.popShareStdUpper = this.avgRelate(data.popCount, data.sharePercStdUpper, data.popCountMax);
    data.popShareStdLower = this.avgRelate(data.popCount, data.sharePercStdLower, data.popCountMax);

    //update graphs
    this.data = data;
    this.graphs.data = data;
    this.graphs.pending = false;
    this.graphs.update();
};

DataManager.prototype.avgRelate = function (arr1, arr2, max) {
    var temp = arr1.map((val, idx) => {
        return {
            a1: val,
            a2: arr2[idx]
        }
    });

    max = max + 1;
    var result = [max];
    for(var i = 0; i < max; i++) {
        var temp2 = temp.filter((obj) => { return Math.round(obj.a1) == i; })
            .map((obj) => { return obj.a2 });
        var avg = average(temp2);

        result[i] = avg;
    }

    return result;
}

DataManager.prototype.clear = function () {
    this.graphs.pending = true;
};


// the "main" code begins here
var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./img/hsl.png");

var socket = null;
if (window.io !== undefined) {
    console.log("Database connected!");
    socket = io.connect('http://24.16.255.56:8888');
}

var canvas;

function getMousePos(ctx, evt) {
    var rect = ctx.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * ctx.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * ctx.height
    };
}
