//Hint:  I don't code in Javascript, I don't know shit.
//Hint:  I made this ghetto shit to import stuff.  Just use it okay?
//This is a hack muthafucker

//////////Used to include code/////////////////////////

// can use include('javascript.js') now

var _ONDRONE_ = false;

var fs = require("fs");
var _include_defs = {};

function read(f) {
    return fs.readFileSync(f).toString();
}

function include(f) {

    if (_include_defs[f] != undefined) { // make sure you don't include the file twice
        console.log("WARNING: File already included: ( " + f + " )");
        return;
    }

    eval.apply(global, [read(f)]);
    _include_defs[f] = 'defined';


}

///////////////include files here///////////////////////////////////
//order surprisingly doesn't matter
var MOVEMENT_ENABLED = true;


include('bootstrapper.js');
include('gps.js');
include('movement.js');
include('toolset.js');
//include('xboxcontroller.js');
include('pathfinding.js')
include('webserver.js')
include('vision.js')
include('followmode.js')

if (_ONDRONE_) {
    //include ("MBED.js or whatever")
}

var express = require('express');
var app = express();

var autonomy = require('ardrone-autonomy'); //useful library to check out
var arDrone = require('ar-drone');
//var HID = require('node-hid');
//var xbox = require('node-xboxdrv');
var opencv = require('opencv');

var xls = require('xlsjs');
var events = require('events');

var keypress = require('keypress');

var eventEmitter = new events.EventEmitter();

var stream = arDrone.createUdpNavdataStream();

var drone = arDrone.createClient();
var boot = new _bootstrapper();
var move = {};
move.client = drone;
//var move = new _movement(boot, drone, autonomy, eventEmitter);
//var controller = new _xboxcontroller(boot, xbox)
//var gps = new _gps(boot, drone , eventEmitter);
//var pathfinder = new _pathfinder( gps , xls) ;
var vision = new _vision(opencv, drone, stream, eventEmitter);
//var web = new _webserver(app,eventEmitter, undefined);
var followmode = new _followmode(move, eventEmitter);


keypress(process.stdin);
set = false;
//move.setGPS ( gps );		// MUST CALL HERE
//move.pathfinder = pathfinder;



eventEmitter.on('nodereached', function() {
    console.log("EVENT ACTION: got to the node");
    process.exit(0);
})




var land = function() {
    console.log("taking off");
    if (gps.hasGPSData) {
        move.client.land();
    }



    if (gps.hasGPSData) {

        console.log("taking off");
        batteryTest();
        move.client.takeoff();
    }
}



var batteryTest = function() {
    console.log("Battery:  " + gps.getBattery());

}





process.stdin.on('keypress', function(ch, key) {
        //console.log("got keypress:  "+key);

        if (key.name == 't') {
            move.client.takeoff();
        }
        if (key.name == 'p') {
            vision.startDetectingPeople(vision);
            vision.startDetectingFaces(vision);
            //vision.startDetectingColor(vision);

        }


        if (key.name == 'l') {
            move.client.land();
        }


    })
    //var id1 = controller.addFunctionToMapping("x",movegpslocation, 0, 15000, 29999);
    //var id2 = controller.addFunctionToMapping("y",land, 0, 15000, 29999);
    //var id3 = controller.addFunctionToMapping("leftBumper", takeoff, 0, 15000, 29999);
    //var id4 = controller.addFunctionToMapping("rightBumper", move.land(), 0, 15000, 29999);

//move.moveToGPS();
//	//console.log("callback being called");
//set  = true;
//console.log("this.longitude: "+gps.longitude);



//////////////////////////////////////////



//var gps  = new _gps(boot, drone);
var g = new Graph();
g.addVertex('A', {
    B: 7,
    C: 8
});
g.addVertex('B', {
    A: 7,
    F: 2
});
g.addVertex('C', {
    A: 8,
    F: 6,
    G: 4
});
g.addVertex('D', {
    F: 8
});
g.addVertex('E', {
    H: 1
});
g.addVertex('F', {
    B: 2,
    C: 6,
    D: 8,
    G: 9,
    H: 3
});
g.addVertex('G', {
    C: 4,
    F: 9
});
g.addVertex('H', {
    E: 1,
    F: 3
});

start = 'A';
end = 'B';
shortestPath = g.shortestPath(start, end).concat([start]).reverse();
console.log(shortestPath);



var lat1 = -21.122;
console.log(_toolset.getGPSDistance(33.7737, -84.3979, 33.7745857, -84.3977203));
console.log(_toolset.getGPSBearing(33.7745857, -84.3977203, 33.7737, -84.3979))
    //var printStuff = function(){
    //	console.log("called from print stuff");
    //}