//@TODO:  Everything
//@TODO:  Testing
//@TODO:  Documentation

/**
	This is the gps module.  It should publish to location.  subscribe to nothing
	Just placeholder code for now

	**/  

var ___move;
var MAX_ANGLE_ERROR = 5;
var MAX_CORRECTIONS = 5;
var bug = false;
var navigate = true;
var DEBUG_NO_MOVE  = true;

function _movement(bootstrapper , client, autonomy, eventEmitter,  gps){

	___move = this;

	this.name = "movement";
	this.client = client;
	console.log("created movement");
	bootstrapper.addPublisherToTopic("location", this);	// fix this
	//this.gps = gps;
	this.autonomy = autonomy;
	this.eventEmitter  = eventEmitter;

//	this.moveToGPS();
//	console.log("latitiude is :  "+gps.getLatitude());

   //this.mission = this.autonomy.createMission();
   this.control =  new autonomy.Controller(client, {debug: false});

	
	console.log("STARTING MOVEMENT");
	eventEmitter.on('stopnavigating', function (){
		navigate = false;
	})

	eventEmitter.on('startnavigating', function (){
		navigate = true;
	})

	eventEmitter.on('land', function (){
		console.log("GOT LAND REQUEST");
		___move.land();
	})
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
		//___move.control().disable();
		___move.client.land();
	}
});

//this is a temporary function to be re
//placed with pathfinder thing
// WARNING 
/*_movement.prototype.t_getNextGPSLocation = function ( ){
	var nextnode = {};
	nextnode.lat = 33.777172;		// this is the klaus location
	nextnode.lon = -84.396446;

	return nextnode;


}*/

_movement.prototype.getClient = function() {
	return this.control._client;
}

_movement.prototype.setGPS = function ( gps ){
	console.log("GPS SET");
	this.gps = gps;
}




_movement.prototype.takeoff = function ( ){
	console.log("takeoff | called");
	if (DEBUG_NO_MOVE){
		console.log("WARNING:  DEBUG_NO_MOVE ENABLED NO TAKEOFF");
		return;
	}
	this.client.takeoff();
	//this.control.hover();
	this.control.enable();
	this.control.altitude(1.5);	// change back to 2
	this.eventEmitter.emit('speech', "HEY ITS STRING LETS FLY");
	

}	

_movement.prototype.land = function (){
	var that = this;
	console.log("land called");
	this.control.disable();
	this.client.land();
	this.eventEmitter.emit('speech', "WELL THAT WAS A GREAT FLIGHT.  IM REALLY THANKFUL THAT I GOT TO GIVE YOU A TOUR TODAY WOW ");

}

_movement.prototype.idle = function (){
	this.control.altitude(1.5);
	this.control.hover();
}

_movement.prototype.rotateRelativeAngle = function  ( angle, callback ){
	var that = this;
	this.control.zero();
	
	if (callback !=undefined ){
		this.control.go({ yaw: (angle) }, callback());
	}else{
		this.control.go({ yaw: (angle) });

	}
	

	
}

_movement.prototype.rotateAbsoluteAngle = function ( angle, callback ){
	var that = this;
	this.control.zero();
	this.control.go( { yaw: angle - that.gps.getOrientation()} );
	if (callback !=undefined ){
		this.control.go({ yaw: (angle- that.gps.getOrientation()) }, callback());
	}else{
		this.control.go({ yaw: (angle- that.gps.getOrientation()) });

	}

}

_movement.prototype.forward = function ( ){
	console.log("start forward");
	this.control.go({x:1}, function (){
		console.log("-!-Event: finsihed going forward")
	});
}


//istance = 0.5;
_movement.prototype.moveToGPS = function( latitudeto, longitudeto, callback ) {

	console.log("GPS2");
	//console.log()
	var that  = this;
	
	//console.log(this.gps.getLatitude());


	console.log("move to gps called");
		console.log("---------------------------------------------------------");

	/*var goforward = function (){
		that.control.zero();
		//if ( (Math.floor(Math.random()*10)+1) > 5){
			that.control.go({x:distance}, function (){
				that.control.hover();
				distance = distance * -1;
			});
		//	});
		//}
	
	}*/

	var currentLatitude = this.gps.getLatitude();
	var currentLongitude = this.gps.getLongitude();

	var distance = _toolset.getGPSDistance ( currentLatitude, currentLongitude, latitudeto, longitudeto);
	var bearing = _toolset.getGPSBearing ( currentLatitude, currentLongitude, latitudeto, longitudeto);

	console.log("-!-bearing:  "+bearing);
	console.log("-!-distance:  "+distance);

	if ( bug ){
		distance = 1;
	}

	var numCorrections = 0;

	var moveDistance  = function (){
		if (!navigate){
			return;
		}
		//return;
		console.log("EVENT:  moving");

		that.control.zero();
		that.control.go( { x: distance/4 }, function (){
			console.log("Event:  movement : finished moving to goal node")
			numCorrections = 0;

			if (callback != undefined ){
				callback(true);
			}
		} );
	}



	// correct the angle to be within acceptable yaw (MAX_ANGLE_ERROR)
	// if try more than MAX_CORRECTIONS we just quit
	var correctBearing = function (){
		if (!navigate){
			return ;
		}
		var angle_error = Math.abs(bearing - that.gps.getOrientation());
		console.log("-!-EVENT:  correcting bearing:  "+angle_error);
		if ( numCorrections > MAX_CORRECTIONS ){
			numCorrections = 0;
			console.log ( "ERROR:  could not successfully correct error" ); 
			if (callback !=undefined){
				callback(false);
			}
		}else if (angle_error > MAX_ANGLE_ERROR){
			numCorrections++;

			that.control.zero();
			that.control.go( { yaw: (bearing - that.gps.getOrientation()) }, correctBearing);
		}else{
			setTimeout(function (){
				setTimeout(moveDistance, 1000);

			}, 1500);
		}
	}

	var moveNode = function ( ) {

		var angle_error = Math.abs(bearing - that.gps.getOrientation());
		console.log("angle error is:  "+angle_error);
		console.log("bearing is:  "+bearing);



		that.control.zero();
		if (angle_error > MAX_ANGLE_ERROR){
			correctBearing( );	
		}else{
			moveDistance ();
		}

	}

	console.log("-!-trying to climb altitude");
	that.control.zero();
	moveNode();
	//that.control.altitude (2, correctBearing);
	//that.control.go({yaw: (bearing - that.gps.getOrientation()) }, moveNode);

}



