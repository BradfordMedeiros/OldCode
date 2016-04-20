//@TODO:  Everything
//@TODO:  Testing
//@TODO:  Documentation

/**
	This is the gps module.  It should publish to location.  subscribe to nothing
	Just placeholder code for now

	**/  


function _movement(bootstrapper , autonomy, gps){
	this.name = "movement";
	bootstrapper.addPublisherToTopic("location", this);	// fix this
	this.gps = gps;
	this.autonomy = autonomy;

	this.moveToGPS();
//	console.log("latitiude is :  "+gps.getLatitude());

	/*this.mission = this.autonomy.createMission();
	this.mission.takeoff().hover(1000).land();

	mission.run(function (err, result) {
    	if (err) {
        	console.trace("Oops, something bad happened: %s", err.message);
        	mission.client().stop();
        	mission.client().land();
    	} else {
        	console.log("Mission success!");
       // process.exit(0);
    	}
	});
	console.log("STARTING MOVEMENT");*/
}

// Land on ctrl-c
var exiting = false;
process.on('SIGINT', function() {
	if (exiting) {
		process.exit(0);
	} else {
		console.log('Got SIGINT. Landing, press Control-C again to force exit.');
		exiting = true;
		//mission.control().disable();
		//mission.client().land(function() {
		//	process.exit(0);
		//});
	}
});

//this is a temporary function to be replaced with pathfinder thing
// WARNING 
_movement.prototype.t_getNextGPSLocation = function ( ){
	var nextnode = {};
	nextnode.lat = 33.7756563;
	nextnode.lon = -84.3978105
	return nextnode;

}

_movement.prototype.getCurrentClient = function() {

}


// takes in a latitiude and longitude and tries to move the drone to the location
// makes a best effort, not reliable 
_movement.prototype.moveToGPS = function() {

	//zero position

	console.log("MOVING TO NEXT")

	//var nextgps = this.t_getNextGPSLocation();

	this.convertXYOffset(this.t_getNextGPSLocation());
	//this.mission.zero();
	//this.mission.
	// get X, Y offset

	// move to new position

}


//return the (x,y) offset to get from nondefrom to nodeto
// nodefrom.x + x = nodeto.x
// nodefrom.y + y = nodeto.y
// nodes specify in lat, lon but this returns in meters
_movement.prototype.convertXYOffset = function ( nodeto){
	console.log("CONVERTING XY OFFSET");
	console.log(nodeto);

	var currentlocation = { };
	currentlocation.lat = this.gps.getLatitude();
	currentlocation.lon = this.gps.getLongitude();

	currentlocation.lat = 33.8;
	currentlocation.lon = -85;
	if ( currentlocation.lat == undefined || currentlocation.lon == undefined ){
		return undefined;
	}

	var converted = {};
	var lat1 = nodeto.lat;
	var long1 = nodeto.lon;
	var lat2 = currentlocation.lat;
	var long2 = currentlocation.lon;



	var y = Math.sin( long2 - long1 ) * Math.cos(lat2);
	var x = Math.cos( lat1 ) * Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(long2-long1);

	//var brng = Math.atan(y,x).toDegrees();
	converted.x = x;
	converted.y = y;

	console.log("converted is:  x: "+converted.x+ "  y: "+converted.y);
	return converted;
}


