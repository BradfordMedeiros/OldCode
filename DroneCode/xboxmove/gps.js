//@TODO:  Everything
//@TODO:  Testing

/**
	This is the gps module.  It should publish to location.  subscribe to nothing
	Just placeholder code for now

	**/  

var EXPIRATION_TIME = 10000; 	// expires in x milliseconds (10000 = 10 seconds)

function _gps(bootstrapper, droneClient){
	this.name = "gps";
	this.latitude = undefined;
	this.longitude = undefined;
	this.timestamp = undefined;
	

	bootstrapper.addPublisherToTopic("location", this);

	droneClient.config('general:navdata_demo', 'FALSE'); // get back all data the copter can send
	droneClient.config('general:navdata_options', 777060865); // turn on GPS
	droneClient.on('navdata', function(navdata) {
		if (navdata && navdata.gps){
			//console.log("nav data:  "+navdata.gps.latitude);
			//console.log(navdata.gps.longitude);
			this.latitude = navdata.gps.latitude;
			this.longitude = navdata.gps.longitude;
			this.timestamp = (new Date()).getTime();
		}
	});
}

_gps.prototype.getLongitude = function(){
	if (this.longitude !=undefined && (  (new Date()).getTime()- this.timestamp < EXPIRATION_TIME )  ) {
		return this.longitude;
	}
}
_gps.prototype.getLatitude = function(){
	if (this.latitude !=undefined && (  (new Date()).getTime()- this.timestamp < EXPIRATION_TIME )  ) {
		return this.latitude;
	}
}
