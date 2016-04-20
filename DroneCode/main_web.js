//Hint:  I don't code in Javascript, I don't know shit.
//Hint:  I made this ghetto shit to import stuff.  Just use it okay?
//This is a hack muthafucker

//////////Used to include code/////////////////////////

// can use include('javascript.js') now

var _ONDRONE_ = false;

var fs = require("fs");

var _include_defs = {};

function read(f){
	return fs.readFileSync(f).toString();
}

function include(f){

	if (_include_defs[f] != undefined ){					// make sure you don't include the file twice
		console.log("WARNING: File already included: ( "+f+" )");
		return;
	}
	
	eval.apply(global,[read(f)]);
	_include_defs[f] = 'defined';
	

}

///////////////include files here///////////////////////////////////
include ('webserver.js');
include ('gps.js');
include ('bootstrapper.js')
include ('vision.js')
include ('xboxcontroller.js')

var express = require('express');
var events  = require('events');
var drone = require ('ar-drone');
var opencv = require('opencv');
var HID = require('node-hid');
var xbox = require('node-xboxdrv');

var boot = new _bootstrapper();

var controller = new _xboxcontroller(boot, xbox);



var eventEmitter = new events.EventEmitter();
var app = express();

var stream = drone.createUdpNavdataStream();
var client = drone.createClient();



var vision = new _vision( opencv, client, stream, eventEmitter);




//var gps = new _gps();	// need to include all the shit

//var boot = new _bootstrapper();
//var gps = new _gps (boot, client, eventEmitter)
var web = new _webserver(app,eventEmitter, undefined);


eventEmitter.on('web:dronestate:navigation', function(){
	console.log("(DEBUG):  drone in navigation mode");
})

eventEmitter.on('web:dronestate:follow', function(){
	console.log("(DEBUG):  drone in navigation mode");
})

eventEmitter.on('web:dronestate:info', function(){
	console.log("(DEBUG):  drone in navigation mode");
})

eventEmitter.on('vision:persondetected', function (face){

	console.log("number people detected:   "+face.length);
})

eventEmitter.on('vision:facedetected', function (face){

	console.log("number face detected:   "+face.length);
})

web.changeMode('follow');



var id1 = controller.addFunctionToMapping("x",function(){
	console.log("x pressed");
}, 0, 15000, 29999);



controller.addFunctionToMapping("x",function (){
	vision.startDetectingColor(vision);
}, 0, 15000, 29999);
controller.addFunctionToMapping("y",function (){
	vision.stopDetectingColor(vision);
}, 0, 15000, 29999);
