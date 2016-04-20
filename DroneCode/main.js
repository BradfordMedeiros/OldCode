var _ONDRONE_ = false;
var fs = require("fs");
var _include_defs = {};

function read(f){
	return fs.readFileSync(f).toString();
}

function include(f){
	if (_include_defs[f] != undefined ){
		console.log("WARNING: File already included: ( "+f+" )");
		return;
	}
	eval.apply(global,[read(f)]);
	_include_defs[f] = 'defined';
}

///////////////include files here///////////////////////////////////
var MOVEMENT_ENABLED = true;
include('bootstrapper.js');
include('gps.js');
include('movement.js');
include('toolset.js');
include('pathfinding.js')
include('webserver.js')
include('vision.js')
include('followmode.js')
//include('xboxcontroller.js');

var express = require('express');
var app = express();
var autonomy = require('ardrone-autonomy');	
var arDrone = require('ar-drone');
var opencv = require('opencv');
var xls = require('xlsjs');
var events = require ('events');
var keypress=  require('keypress');
var eventEmitter = new events.EventEmitter();
var stream = arDrone.createUdpNavdataStream();
//var HID = require('node-hid');
//var xbox = require('node-xboxdrv');


var drone = arDrone.createClient();
var boot = new _bootstrapper();
var move = new _movement(boot, drone, autonomy, eventEmitter);
var gps = new _gps(boot, drone , eventEmitter);
var pathfinder = new _pathfinder( gps , xls) ;
var vision = new _vision( opencv, drone, stream, eventEmitter);
var web = new _webserver(app,eventEmitter, gps);
followmode = new _followmode(move, drone,  eventEmitter);
//var controller = new _xboxcontroller(boot, xbox)

require('ar-drone-png-stream')(drone, {port:8000});
var dronestate = 'idle';
var inAir = false;
var isSetDestination = false;
var destination = 'none';
var isNavigating = false;
var navHandle = undefined;

keypress(process.stdin);
set = false;
move.setGPS ( gps );
move.pathfinder = pathfinder;

var movegpslocation= function(){
	console.log("MOVE GPS LOCATION CALLED >>>>>>>>>>>>>>>>>>>>>>>>>>>------------");
	console.log("pressed x we're gonna move biatch");
	console.log(gps.hasGPSData());   
	if (gps.hasGPSData){
		console.log("X Pressed Now moving");
		//move.takeoff();
		if (lastnode != undefined){
			var d_error = _toolset.getGPSDistance(lastnode.latitude, lastnode.longitude, gps.getLatitude(), gps.getLongitude());
			console.log("distance error is : "+d_error);
		}
		var nextnode = pathfinder.getNextNode();
		lastnode = nextnode;
		console.log(nextnode.latitude);
		console.log(nextnode.longitude);
		console.log("next node:  "+nextnode.name);
		move.moveToGPS( nextnode.latitude, nextnode.longitude, movegpslocation);
	} else{
		console.log("no gps")
	}                                                                                                                                                                                                                                                                                                                                                                                                                    []
}

//User controlled event: start following mode.
var onStartFollow = function (){
	console.log("--UI CONTROL EVENT-- : onStartFollow");
	var onstart = function (){
		vision.startDetectingFaces(vision);
		drone.animateLeds('redSnake', 5, 10);
	}
	move.takeoff();
	inAir = true;
	setTimeout(onstart, 5000);
}

//User controlled event: stop following mode.
var onStopFollow = function (){
	console.log("--UI CONTROL EVENT-- : onStopFollow");
	vision.stopDetectingFaces(vision);
	move.control.enable();
	move.control.zero();
	move.idle();
}

//User controlled event: stop navigation mode.
var onStopNavigation = function (){
	console.log("--UI CONTROL EVENT-- : onStopNavigation");
	if (navHandle != undefined){
		clearInterval(navHandle);
	}
	isNavigating = false;
	isSetDestination = false;
	destination = 'none';
	move.control.zero();
	move.control.hover();
	eventEmitter.emit('stopnavigating');
	console.log("ON STOP navigation (LIMITIED");
}

//User controlled event: start navigation mode.
var onStartNavigation = function (){
	console.log("--UI CONTROL EVENT-- : onStartNavigation");
	isNavigating = true;
	var startnav = function (){
		drone.animateLeds('doubleMissile', 5, 10);
		move.control.enable();
		move.idle();
		navHandle = setInterval(function (){	// check every second to see if destination is set
			if (isSetDestination && destination !='none'){
				console.log("SET DESTINATION (qe):  "+destination);
				pathfinder.setDestination(destination);
				movegpslocation();
				clearInterval(navHandle)
			}
		}, 1000);
		eventEmitter.emit('startnavigating');
	}

	if (!inAir){
		move.takeoff();
		setTimeout(function (){
			startnav();
		},7000);
	}else{
		startnav();
	}
}


/*
followmode.move.control.disable();


	console.log("EVENT:  vision: Color Detection turned on");
	if (!that.isOnColorDetection){
		that.colorDetectIntervalHandle = setInterval(function(){that.detectColor(that)}, 150);

	}
	that.isOnColorDetection = true;
}

_vision.prototype.stopDetectingColor = function ( that ){
	console.log("EVENT:  vision: Color Detection turned off");
	if (that.isOnColorDetection){
		clearInterval(that.colorDetectIntervalHandle);
	}
	that.isOnColorDetection = false;
*/

eventEmitter.on('nodereached', function(){
			console.log("EVENT ACTION: got to the node");
			process.exit(0);
})

eventEmitter.on('movement:requestdronestate', function (state){
	console.log(state);
	if (state == 'navigation'){
		console.log("GOT CHANGE TO NAVIGATION");
		dronestate = 'navigation';
		onStopFollow();
		onStartNavigation();
		
	}
	if (state == 'follow'){
		console.log("GOT CHANGE TO FOLLOW");
		dronestate = 'follow';
		onStopNavigation();
		onStartFollow();
	}
})

eventEmitter.on('movement:navigationrequest', function (location){
	destination = location;
	isSetDestination = true;
	console.log("UI EMITTING NEW NAV SPOT: "+location);
	eventEmitter.emit('movement:requestdronestatenavigate');

})

var land = function (){
	console.log("taking off");
	if (gps.hasGPSData){
		move.land();
		inAir = false;
	}
	if (gps.hasGPSData){
		
		console.log("taking off");
		batteryTest();
		move.takeoff();
		inAir = true;
	}
}

var batteryTest = function (){
	console.log("Battery:  "+gps.getBattery());
}

lastnode = undefined;
m = move;
process.stdin.on('keypress', function (ch, key){
	if (key.name == 't'){
		move.takeoff();
	}
	if (key.name == 'p'){
		vision.startDetectingColor(vision);
	}
	if (key.name == 'f'){
		console.log("forward");
		move.control.disable();
		move.control.go({x:0.5});
		setTimeout(function (){
			drone.front(0);
		}, 1000);
	}
	if (key.name =='l'){
		move.land();
	}
	if (key.name == 'b'){
		console.log(gps.getBattery());
	}
	if (key.name == 'g'){
		console.log(gps.getLatitude());
	}
})