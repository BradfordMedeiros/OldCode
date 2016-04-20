//@TODO:  Everything
//@TODO:  Testing

/**

gps.elevation
demo.rotation.pitch
demo.roll
demo.yaw
	This is the gps module.  It should publish to location.  subscribe to nothing
	Just placeholder code for now

	**/  

var EXPIRATION_TIME = 1000; 	// expires in x milliseconds (10000 = 10 seconds)

var DRONE_MOVEMENT_ACCURACY =  0.0000; // 0.0001 is a good number, 0 = perfectly accurate.  1 corresponds to it being able to be 
// 1 whole latitude or longitude off (which is stupidly huge s)

var GPS_VERBOSE = false;

function _gps(bootstrapper, droneClient, eventEmitter, debug){
	that = this;
	this.hasData = false;
	this.name = "gps";
	this.eventEmitter = eventEmitter;
	//this.debug = debug;

	this.callback = function (){
		console.log("callback not set");
	};
	this.latitude = undefined;
	this.longitude = undefined;
	this.elevation = undefined;
	this.degree = undefined;
	this.battery = undefined;
	this.timestamp = undefined;
	this.pitch = undefined;
	this.roll = undefined;
	this.yaw = undefined;

	this.eventEmitter = eventEmitter;
	this.droneClient = droneClient;
	

	bootstrapper.addPublisherToTopic("location", this);

	//droneClient.config('general:navdata_demo', 'FALSE'); // get back all data the copter can send
	droneClient.config('general:navdata_options', 777060865); // turn on GPS
	

	droneClient.on('navdata', function(navdata) {
		//console.log(navdata);

		if (navdata && navdata.demo ){

			that.battery = navdata.demo.batteryPercentage;
			that.degrees = navdata.demo.clockwiseDegrees;
			that.timestamp = (new Date()).getTime();
			if (navdata.demo.rotation){
				that.pitch = navdata.demo.rotation.pitch;
				that.roll = navdata.demo.rotation.roll;
				that.yaw = navdata.demo.rotation.yaw;
			}
			//console.log("degrees:  "+that.degrees);

		}

		//console.log(navdata.demo);

		if (navdata && navdata.gps){
			//console.log("battery:  "+navdata.demo.batteryPercentage);
			//console.log("nav data:  "+navdata.gps.latitude);
			//console.log("longitude: "+navdata.gps.longitude);

			//console.log("degree:  "+navdata.gps.degree);
			//console.log("degree mag:  "+navdata.gps.degreeMag);

			that.latitude = navdata.gps.latitude;
			that.longitude = navdata.gps.longitude;
			that.elevation = navdata.gps.elevation;
			//that.degree = navdata.gps.degree;
			//that.battery = navdata.demo.batteryPercentage;
			that.timestamp = (new Date()).getTime();
			//console.log("set gps");
			that.hasData = true;

			if (that.callback !=undefined){
				//that.callback();	
			}
		}


		if (navdata && navdata.demo && navdata.gps){
			that.eventEmitter.emit('droneinfo');
		}
	});
}

//lat and long are option used only in debugging
_gps.prototype.getGPSNode = function ( lat, lon ) {
	var longitude = this.getLongitude( lon );
	var latitude = this.getLatitude( lat );
	var node = {};
	
	node.longitude = longitude;
	node.latitude = latitude;
	
	return node;

}
_gps.prototype.getLongitude = function( lon ){

	if ( this.debug ){
		console.log("THIS MESSAGE MEANS YOU DID BAD");
		var longitude = lon;

		if (!SUPRESS_WARNINGS){
			console.log("WARNING: calling debug code");
		}

		if (Math.random() > 0.5 ){
			return (longitude+ Math.random() * DRONE_MOVEMENT_ACCURACY);
		}else {
			return (longitude- Math.random() * DRONE_MOVEMENT_ACCURACY);
		}
	}

	if (this.longitude !=undefined && (  (new Date()).getTime()- this.timestamp < EXPIRATION_TIME )  ) {
		if (GPS_VERBOSE){
			console.log("GPS EVENT:  getting real location");
	
		}

		return this.longitude;
	}else{
		if (GPS_VERBOSE){
			console.log("GPS EVENT:  (ERROR) could not get longitude");

		}
	}
}
_gps.prototype.getLatitude = function( lat ){
	if ( this.debug ){
						console.log("WARNING CALLING DEBUG CODE");

		var latitude = lat;

		if (!SUPRESS_WARNINGS){
			console.log("WARNING: calling debug code");
		}

		if (Math.random() > 0.5 ){
			return (latitude + Math.random() * DRONE_MOVEMENT_ACCURACY);
		}else {
			return (latitude - Math.random() * DRONE_MOVEMENT_ACCURACY);
		}
	}

	if (this.latitude !=undefined && (  (new Date()).getTime()- this.timestamp < EXPIRATION_TIME )  ) {
		if (GPS_VERBOSE){
			console.log("GPS EVENT:  getting real location");

		}
		return this.latitude;
	}else{
		if (GPS_VERBOSE){
			console.log("GPS EVENT:  (ERROR) could not get latitude");
		
		}
	}
}

_gps.prototype.getOrientation = function (){
	if (this.degrees !=undefined && (  (new Date()).getTime()- this.timestamp < EXPIRATION_TIME )  ) {
		return this.degrees;
	}
}

_gps.prototype.getPitch = function (){
	if (this.pitch !=undefined && (  (new Date()).getTime()- this.timestamp < EXPIRATION_TIME )  ) {
		return this.pitch;
	}
}

_gps.prototype.getRoll = function (){
	if (this.roll !=undefined && (  (new Date()).getTime()- this.timestamp < EXPIRATION_TIME )  ) {
		return this.roll;
	}
}

_gps.prototype.getYaw = function (){
	if (this.degrees !=undefined && (  (new Date()).getTime()- this.timestamp < EXPIRATION_TIME )  ) {
		return this.yaw;
	}
}

_gps.prototype.getElevation = function (){
	if (this.elevation !=undefined && (  (new Date()).getTime()- this.timestamp < EXPIRATION_TIME )  ) {
		return this.elevation;
	}
}



_gps.prototype.getBattery = function (){
	if (this.battery !=undefined && (  (new Date()).getTime()- this.timestamp < EXPIRATION_TIME )  ) {
		return this.battery;
	}
}

_gps.prototype.setCallback = function ( callback){
	this.callback = callback;
	callback();
}

_gps.prototype.hasGPSData = function (){
	return this.hasData;
}

