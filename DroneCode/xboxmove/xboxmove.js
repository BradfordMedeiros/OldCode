//Hint:  I don't code in Javascript, I don't know shit.
//Hint:  I made this ghetto shit to import stuff.  Just use it okay?
//This is a hack muthafucker

//////////Used to include code/////////////////////////

// can use include('javascript.js') now

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
//order surprisingly doesn't matter
include('bootstrapper.js');
//include('gps.js');
//include('movement.js');
//include('toolset.js');
//include('mbed.js');
//include('nodegenerator.js');
include('xboxcontroller.js');

var autonomy = require('ardrone-autonomy');	//useful library to check out
var arDrone = require('ar-drone');
var drone = arDrone.createClient();


console.log('here i am');

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



var MOVEMENT_ENABLED = true;


var HID = require('node-hid');
var xbox = require('node-xboxdrv');

var boot = new _bootstrapper();
var con = new _xboxcontroller(boot, xbox)
//var gps = new _gps(boot, drone);
//var move = new _movement(boot, autonomy, gps );

//var printStuff = function(){
//	console.log("called from print stuff");
//}


var count = 0;

//PROBLEMS WITH CONTROLS RIGHT NOW IS WE RELY ON NEW DATA
// SO IF ITS HELD IN PLACE IT DOES NOTHIGN
// NEED TO CREATE VARIABLES TO TOGGLE SHIT INSTEAD
// OK FOR NOW CAUSE TOO LAZY ATM

///////////////LEFT STICK X AXIS
var moveLRHard = function(){
	console.log("Leftstick right: HARD:  "+count+"\n");
	count++;
}

var moveLRSoft = function(){
	console.log("Leftstick right: SOFT: "+count+"\n");
	count++;
}

var moveLLHard = function(){
	console.log("Leftstick left: HARD:  "+count+"\n");
	count++;
}

var moveLLSoft = function(){
	console.log("Leftstick left: SOFT: "+count+"\n");
	count++;
}

////////////////////LEFT STICK Y AXIS
var moveLUHard = function(){
	console.log("Leftstick up: HARD:  "+count+"\n");
	count++;
}

var moveLUSoft = function(){
	console.log("Leftstick up: SOFT: "+count+"\n");
	count++;
}

var moveLDHard = function(){
	console.log("Leftstick down: HARD:  "+count+"\n");
	count++;
}

var moveLDSoft = function(){
	console.log("Leftstick down: SOFT: "+count+"\n");
	count++;
}
//////////////////////////////////////////////

///////////////RIGHT STICK X AXIS
var moveRRHard = function(){
	console.log("Rightstick right: HARD:  "+count+"\n");
	count++;
}

var moveRRSoft = function(){
	console.log("Rightstick right: SOFT: "+count+"\n");
	count++;
}

var moveRLHard = function(){
	console.log("Rightstick left: HARD:  "+count+"\n");
	count++;
}

var moveRLSoft = function(){
	console.log("Rightstick left: SOFT: "+count+"\n");
	count++;
}

////////////////////Right STICK Y AXIS
var moveRUHard = function(){
	console.log("Rightstick up: HARD:  "+count+"\n");
	count++;
}

var moveRUSoft = function(){
	console.log("Rightstick up: SOFT: "+count+"\n");
	count++;
}

var moveRDHard = function(){
	console.log("Rightstick down: HARD:  "+count+"\n");
	count++;
}

var moveRDSoft = function(){
	console.log("Rightstick down: SOFT: "+count+"\n");
	count++;
}

var inAir = false;


var takeoffandland = function(){
	if (MOVEMENT_ENABLED){
		if (inAir){
		drone.land();
		inAir = false;
		console.log("!DRONE MOVEMENT:  landing");

	}else{
		drone.takeoff();
		inAir = true;
		console.log("!DRONE MOVEMENT:  taking off");

	}
}
	

}

var leftBumper2= function(){
	var lat = gps.getLatitude();
	if (lat == undefined){
		console.log("cannot get latitude")
	}else{
		console.log("gps latitude:  "+lat);
	}
	
}


///strafe forward and back
var droneforwardhard = function(){
	if (MOVEMENT_ENABLED){
		drone.front(1);

	}
	console.log("!DRONE MOVEMENT:  STRAFE FORWARD (HIGH SPEED)");

}

var droneforwardsoft = function(){
	if (MOVEMENT_ENABLED){
		drone.front(0.1);
	}
	console.log("!DRONE MOVEMENT:  STRAFE FORWARD (LOW SPEED)");

}


var dronebackhard = function(){
	if (MOVEMENT_ENABLED){
		drone.back(1);

	}
	console.log("!DRONE MOVEMENT:  STRAFE BACK (HIGH SPEED)");


}

var dronebacksoft = function(){
	if (MOVEMENT_ENABLED){
		drone.back(0.1);

	}
	console.log("!DRONE MOVEMENT:  STRAFE BACK (LOW SPEED)");

}

//strafing left/right
var movelefthard = function(){
	if (MOVEMENT_ENABLED){
		drone.left(1);

	}
	console.log("!DRONE MOVEMENT:  STRAFE LEFT (HIGH SPEED)");

}

var moveleftsoft = function(){
	if (MOVEMENT_ENABLED){
		drone.left(0.1);
	}
	console.log("!DRONE MOVEMENT:  STRAFE LEFT (LOW SPEED)");

}


var moverighthard = function(){
	if (MOVEMENT_ENABLED){
		drone.right(1);
	}
	console.log("!DRONE MOVEMENT:  STRAFE RIGHT (HIGH SPEED)");


}

var moverightsoft = function(){
	if (MOVEMENT_ENABLED){
		drone.right(0.1);
	}
	console.log("!DRONE MOVEMENT:  STRAFE RIGHT (LOW SPEED)");

}

///////////UP AND DOWN
var moveuphard = function(){
	if (MOVEMENT_ENABLED){
		drone.up(2);

	}
	console.log("!DRONE MOVEMENT:  ALTITUDE UP (HIGH SPEED)");

}

var moveupsoft = function(){
	if (MOVEMENT_ENABLED){
		drone.up(1);
	}
	console.log("!DRONE MOVEMENT:  ALTITUDE UP (LOW SPEED)");

}


var movedownhard = function(){
	if (MOVEMENT_ENABLED){
		drone.down(1);
	}
	console.log("!DRONE MOVEMENT:  ALTITUDE DOWN (HIGH SPEED)");


}

var movedownsoft = function(){
	if (MOVEMENT_ENABLED){
		drone.down(0.1);
	}
	console.log("!DRONE MOVEMENT:  ALTITUDE DOWN (LOW SPEED)");

}


//hover
var hover = function(){
	if (MOVEMENT_ENABLED){
			drone.stop();
	}
}


//rotations
var rotateRightSoft = function(){
	if (MOVEMENT_ENABLED){
			drone.clockwise(0.1);

	}
	console.log("!DRONE MOVEMENT:  CLOCKWISE TURN (LOW SPEED)");

}

var rotateRightHard = function(){
	if (MOVEMENT_ENABLED){
			drone.clockwise(1);
	}
	console.log("!DRONE MOVEMENT:  CLOCKWISE TURN (HIGH SPEED)");

}

var rotateLeftSoft = function(){
	if (MOVEMENT_ENABLED){
			drone.counterClockwise(0.1)
	}
	console.log("!DRONE MOVEMENT:  COUNTER-CLOCKWISE TURN (LOW SPEED)");


}

var rotateLeftHard = function(){
	if (!MOVEMENT_ENABLED){
		return;
	}
		drone.counterClockwise(1);
		console.log("!DRONE MOVEMENT:  COUNTER-CLOCKWISE TURN (HIGH SPEED)");

}



//Buttons
//con.addFunctionToMapping('leftBumper',leftBumper1,0,undefined, undefined);
con.addFunctionToMapping('leftBumper',takeoffandland,0,undefined, undefined);
con.addFunctionToMapping('x', hover, 0, undefined, undefined);

//LEFT STICK
var id = con.addFunctionToMapping("leftX",moverightsoft, 0, 15000, 29999);
var id = con.addFunctionToMapping("leftX",moverighthard,0, 30000, Infinity);
var id = con.addFunctionToMapping("leftX",movelefthard, 0, -Infinity, -30000);
var id = con.addFunctionToMapping("leftX",moveleftsoft, 0, -29999, -15000);

var id = con.addFunctionToMapping("leftY",droneforwardsoft, 0, 15000, 29999);
var id = con.addFunctionToMapping("leftY",droneforwardhard, 0, 30000, Infinity);
var id = con.addFunctionToMapping("leftY",dronebackhard, 0, -Infinity, -30000);
var id = con.addFunctionToMapping("leftY",dronebacksoft, 0, -29999, -15000);

//RIGHT STICK
var id = con.addFunctionToMapping("rightX",rotateRightSoft, 0, 15000, 29999);
var id = con.addFunctionToMapping("rightX",rotateRightHard, 0, 30000, Infinity);
var id = con.addFunctionToMapping("rightX",rotateLeftHard, 0, -Infinity, -30000);
var id = con.addFunctionToMapping("rightX",rotateLeftSoft, 0, -29999, -15000);

var id = con.addFunctionToMapping("rightY",moveupsoft, 0, 15000, 29999);
var id = con.addFunctionToMapping("rightY",moveuphard, 0, 30000, Infinity);
var id = con.addFunctionToMapping("rightY",movedownhard, 0, -Infinity, -30000);
var id = con.addFunctionToMapping("rightY",movedownsoft, 0, -29999, -15000);


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

