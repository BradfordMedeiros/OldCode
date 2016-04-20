//@TODO:  Everything
//@TODO:  Testing
//@TODO:  Documentation

/**
	This is the gps module.  It should publish to location.  subscribe to nothing
	Just placeholder code for now

	**/  

var ___move;


function _movement(bootstrapper , autonomy, gps){

	___move = this;

	this.name = "movement";
	console.log("created movement");
	bootstrapper.addPublisherToTopic("location", this);	// fix this
	//this.gps = gps;
	this.autonomy = autonomy;

//	this.moveToGPS();
//	console.log("latitiude is :  "+gps.getLatitude());

   this.mission = this.autonomy.createMission();
   this.control = undefined;

	//this.mission.takeoff().hover(10000).land();		// change this so we dont do the same shit over and over

	/*this.mission.run(function (err, result) {
    	if (err) {
        	console.trace("Oops, something bad happened: %s", err.message);
        	this.mission.client().stop();
        	this.mission.client().land();
    	} else {
        	console.log("Mission success!");
       // process.exit(0);                                                                  
    	}
	});*/
	console.log("STARTING MOVEMENT");
	//this.moveToGPS();
}

// Land on ctrl-c
var exiting = false;
process.on('SIGINT', function() {
	if (exiting) {
		process.exit(0);
	} else {
		console.log('Got SIGINT. Landing, press Control-C again to force exit.');
		exiting = true;
		___move.mission.control().disable();
		___move.mission.client().land();
	}
});

//this is a temporary function to be replaced with pathfinder thing
// WARNING 
_movement.prototype.t_getNextGPSLocation = function ( ){
	var nextnode = {};
	nextnode.lat = 33.777172;		// this is the klaus location
	nextnode.lon = -84.396446;

	return nextnode;


}

_movement.prototype.getCurrentClient = function() {
	return this.mission.client();
}

_movement.prototype.setGPS = function ( gps ){
	this.gps = gps;
}


// takes in a latitiude and longitude and tries to move the drone to the location
// makes a best effort, not reliable '='=
/////////////////////////t//////////////////////////////////////////////////////
_movement.prototype.takeoff = function ( ){



}	

_movement.prototype.land = function (){

}


var firstcall = true;
_movement.prototype.moveToGPS = function( latitudeto, longitudeto) {

	// **@TODO see if you can move takeoff to outside of this function
	// remember to zero position

	console.log("CALLED move to GPS")
	console.log("MOVING TO NEXT")

	

	var TEST = false;//////

	////////////////////////////////////////
	var MAX_ANGLE_ERROR = 10;
	var MAX_CORRECTION_ATTEMPTS = 10;
	var MAX_DISTANCE_TO_MOVE = 50;


	//this.mission = this.autonomy.createMission();
	// get the current longitude and latitude
	var latfrom;
	var longfrom;
	if (TEST){		
		console.log("WARNING:  test code being called");									// hard code next location if testing
		var node = this.t_getNextGPSLocation();		    // if testing start from default location (KLAUS)
		latfrom = node.lat;
		longfrom = node.lon;
	}

	else{
		latfrom = this.gps.getLatitude();				// else rip from gps -
		longfrom = this.gps.getLongitude();
		if ((latfrom == undefined || longfrom ==undefined)  ){				// if we dont know where we are dont move
			console.log("ERROR:  Could not get valid gps coordinates");
			return false;
		}
	}

	/////////////////////////////////////////////////////

	//calculate distance and bearing 
	var distance = _toolset.getGPSDistance ( latfrom, longfrom, latitudeto, longitudeto );
	var bearing = _toolset.getGPSBearing ( latfrom, longfrom, latitudeto, longitudeto );
	


	if (TEST){
		distance = distance/100;
	}
	console.log("distance is:  "+distance);
	console.log("bearing  is:  "+bearing);
	console.log ("battery:  "+this.gps.getBattery());
													
	// IF DISTANCE TO FAR DONT MOVE																																																																																																																																																																																																																																																																																																																																																											
	if (distance > MAX_DISTANCE_TO_MOVE && false ){
		console.log("ERROR DISTANCE TO LARGE ( > "+MAX_DISTANCE_TO_MOVE+" m)");
		process.exit(1);
	}


	this.control = this.mission.control();
	//this.mission.takeoff().hover(1000);

	this.mission.takeoff().zero();

	//this.mission.run();

	var proceed = false;
	 cntrl = this.control;
	var count = 0;



	var godistance  = function(controller){
		controller.go({x:distance}, function(){
			console.log("EVENT: (success) went distance : "+distance);
		});
	}

	// this is the kind function
	// need to test
	var correctBearing = function(controller ){

		console.log("-----correct bearing----------")

		var angle_error =  Math.abs(bearing - ___move.gps.getOrientation());
		console.log("angle error:  "+angle_error);
		if (  (count < MAX_CORRECTION_ATTEMPTS) && (angle_error > MAX_ANGLE_ERROR ) ) {	// add or if angle is good
			___move.mission.zero().go({yaw:bearing - ___move.gps.getOrientation()}).zero().task(function(callback){
					console.log("hello world");
					callback();
			}).go({x:distance});
		}else if (angle_error < MAX_ANGLE_ERROR){	// then should check if correction attempts exceed or angle is cool
			console.log("EVENT: (success) finished correct bearing: tries = " + count);
			//controller.zero();
			console.log("going distance:  "+distance);
			cntrl.zero();
			cntrl.go({x:distance});
			//godistance(controller);	// if angle good move, if not maybe through an error
		}else{								//exceed max correction attempts
			console.log("EVENT: (failure) finished correct bearing: tries = " + count);
			process.exit(0);

		}
	}

	var movedistance = function(){

		___move.mission.zero().go({x:distance});
	}

	/*var correctBearing = function (){
		console.log("-----correct bearing----------")
		var angle_error =  Math.abs(bearing - ___move.gps.getOrientation());
		if (  (count < MAX_CORRECTION_ATTEMPTS) && (angle_error > MAX_ANGLE_ERROR ) ) {	// add or if angle is good
			count++;
			console.log("correction #:  "+count);
			console.log("error:  "+angle_error);
			___move.mission.go({yaw: bearing - ___move.gps.getOrientation()}, function(){
				//correctBearing();
				console.log("finished turning");
			});
		}else if (angle_error < MAX_ANGLE_ERROR){	// then should check if correction attempts exceed or angle is cool
			console.log("EVENT: (success) finished correct bearing: tries = " + count);
		//	ontroller.zero();
			console.log("going distance:  "+distance);
			//godistance(controller);	// if angle good move, if not maybe through an error
		}else{								//exceed max correction attempts
			console.log("EVENT: (failure) finished correct bearing: tries = " + count);
			process.exit(0);

		}

	}*/




	correctBearing(this.control);
	//movedistance();

	var t = 0;
	// see if

	//this.control._enabled = true;
	//this.control.altitude(0.5, correctBearing(this.control));
	this.mission.run(function(){
		console.log("finished it");
		
	});



	//while(!proceed);
	//this.control.go({x:1});
	
	return true;
	

}


//return the (x,y) offset to get from nondefrom to nodeto
// nodefrom.x + x = nodeto.x
// nodefrom.y + y = nodeto.y
// nodes specify in lat, lon but this returns in meters
_movement.prototype.convertXYOffset = function ( nodeto){
	console.log("CONVERTING XY OFFSET");
	return undefined;
}


