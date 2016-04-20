
var _ONDRONE_ = false;

var fs = require("fs");
var _include_defs = {};

function read(f){
  return fs.readFileSync(f).toString();
}

function include(f){

  if (_include_defs[f] != undefined ){          // make sure you don't include the file twice
    console.log("WARNING: File already included: ( "+f+" )");
    return;
  }
  
  eval.apply(global,[read(f)]);
  _include_defs[f] = 'defined';
  

}

///////////////include files here///////////////////////////////

include('gps.js');
include('bootstrapper.js');

var autonomy = require('ardrone-autonomy');
var mission  = autonomy.createMission();
var boot = new _bootstrapper();
var gps = new _gps(boot, mission.client());



var _toolset = {};

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function rad2deg(rad){
  return rad/(Math.PI/180)
}

_toolset.getGPSDistance = function ( lat1,lon1,lat2,lon2 ) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  console.log('dlat '+dLat);
  var dLon = deg2rad(lon2-lon1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c*1000; // Distance in km
  return d;
}


_toolset.getGPSBearing = function ( lat1,lon1,lat2,lon2 ){
  var bearing =Math.atan2(Math.sin(deg2rad(lon2-lon1))*Math.cos(deg2rad(lat2)), Math.cos(deg2rad(lat1))*Math.sin(deg2rad(lat2))-Math.sin(deg2rad(lat1))*Math.cos(deg2rad(lat2))*Math.cos(deg2rad(lon2-lon1)));
  return rad2deg(bearing);
}


///////////////////////////////////////////
var latcurr = 33.777174;
var longcurr = -84.396501;


var bearing =  _toolset.getGPSBearing ( latcurr, longcurr, 0 , 0 )
var Distance = _toolset.getGPSDistance ( latcurr, longcurr, 0 , 0 )

mission.takeoff()
       .zero()       // Sets the current state as the reference
      // .altitude(1)  // Climb to altitude = 1 meter
      // .right(2)     
       //.backward(1) 
      //.left(2)
     // .forward(1)
       .go({x:0, y:0, yaw: 30}) // Hover in place for 1 second
       .land();

mission.run(function (err, result) {
    if (err) {
        console.trace("Oops, something bad happened: %s", err.message);
        mission.client().stop();
        mission.client().land();
    } else {
        console.log("Mission success!");
        process.exit(0);
    }
});

var exiting = false;
process.on('SIGINT', function() {
  if (exiting) {
    //process.exit(0);
  } else {
    console.log('Got SIGINT. Landing, press Control-C again to force exit.');
    exiting = true;
    mission.control().disable();
    mission.client().land(function() {
     // process.exit(0);
    });
  }
});
