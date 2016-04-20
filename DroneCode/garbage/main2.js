//Hint:  I don't code in Javascript, I don't know shit.
//Hint:  I made this ghetto shit to import stuff.  Just use it okay?
//This is a hack muthafucker

//////////Used to include code/////////////////////////

// can use include('javascript.js') now

var fs = require("fs");

function read(f){
	return fs.readFileSync(f).toString();
}

function include(f){
eval.apply(global,[read(f)]);
}

///////////////include files here///////////////////////////////////
//order surprisingly doesn't matter
include('bootstrapper.js');
include('gps.js');
//include('movement.js');
//include('mbed.js');
//include('nodegenerator.js');
//include('xboxcontroller.js');
//
//var autonomy = require('ardrone-autonomy');	//useful library to check out
var arDrone = require('ar-drone');
var drone = arDrone.createClient();


console.log('here');

//to do : implment into GPS class and figure out what functions we should
//rip from it 

/*
*/

//console.log(navdata.gps.latFuse);
//		console.log(navdata.gps.latFuse);

//	console.log(navdata.gpsready);
//   console.log(navdata.gps.latitude + ', ' + navdata.gps.longitude);
   // do stuff with the GPS information....
////});
//droneClient.takeoff();



//var MOVEMENT_ENABLED = false;


//var HID = require('node-hid');
//var xbox = require('node-xboxdrv');

//var boot = new _bootstrapper();
//var con = new _xboxcontroller(boot, xbox)
var gps = new _gps(boot, drone);

//var printStuff = function(){
//	console.log("called from print stuff");
//}


var count = 0;

//PROBLEMS WITH CONTROLS RIGHT NOW IS WE RELY ON NEW DATA
// SO IF ITS HELD IN PLACE IT DOES NOTHIGN

//var id = con.addFunctionToMapping("left",printStuff, 1, 2,3,printStuff,4,5,6);
//con.callFunctionOnPress('rightX',12);
//console.log(con.map["right"]);
//console.log(id);
//con.addFunctionToMapping("right", printStuff, -Infinity, 20);
//console.log(con.map["right"]);
//c//onsole.log(0> -Infinity);
//con.getLocation();
//con.addFunctionToAnalog()

/*


/*

controller.on('leftX',function(){
	console.log('left X');
});


controller.on('leftY',function(){
	console.log('left Y');
});



//xbox.on('a:press', function(key){
//	console.log(key + 'press');
//});)*/


//var boot = new _bootstrapper();
//var gps = new _gps(boot);
//var gps2 = new _gps(boot);ar mbed = new _mbed(boot);

//mbed.writeMbed();

//console.log(gps.getLocation());

/*//boot.topics["speed"] = 3;
var gotlock1 = boot.acquireContentLock("location",gps);
console.log(gotlock1);

var gotlock2 = boot.acquireContentLock("location",gps2);
console.log(gotlock2);

var gotlock1 = boot.acquireContentLock("location",gps);
console.log(gotlock1);
*/
/**boot.addPublisherToTopic("speed","controls");
boot.addPublisherToTopic("speed","AI");
boot.addSubscriberToTopic("speed","wheels")

var boot1 = new _bootstrapper();
console.log(boot.topics["speed"].publishers[0]);
console.log(boot.topics["speed"].publishers[1]);
console.log(boot.topics["speed"].subscribers[0]);
console.log(boot.topics["speed"].subscribers[1]);

var gotlock = boot.acquireContentLock("speed","hello");
boot.releaseContentLock("speed","hello");

console.log("got lock:  "+gotlock);
var gotlock = boot.acquireContentLock("speed","hello");
var mod = boot.modifyTopicContent("speed","hello", 34 )
console.log("mod: "+mod);
console.log(boot.topics["speed"].content);
**/

//console.log("got lock:  "+gotlock);

