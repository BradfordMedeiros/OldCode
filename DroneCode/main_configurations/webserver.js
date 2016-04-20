//Web server for the AR- Drone
//built on express  (requires express node)
// references a bunch of files

//var app = 

// Dependencies:  Needs express 
//---------------------------------------

//Features supported:  
//---------------------------------------
// 1. 	Basic page display (only supports main html page)
// 		Images in images folder in html folder
// 		CSS in css folder in html folder
// 2.   Communication for pins by sending post to /realtime/targetlocation
// 3.	Sending realtime drone info 

// Cool client side shit:
// 1. Ability to send target locations via ajax
// 2. Ability to update drone data without refreshing page
// 3. Red circle follows drone on google map 

// Have 
////////////////////////////////////////////////

__dirname = '/home/samantha/Desktop/Drone Code';
debug = true;	// delete 


// gps is option but you won't get any of the cool info w/o it
function _webserver ( app , eventEmitter, gps){
	//var app = express()
	//var app trueress();
	var that = this;
	this.app = app;
	this.mode = undefined;
	this.eventEmitter = eventEmitter;
	this.gps = gps;

	this.registerRequests();


	this.droneinfo = { };  	// where we will store info for the drone
	this.latitude = 0;
	this.longitude = 0;
	this.battery = 0;
	this.degrees = 0;

	// Starts the server
	this.server = app.listen(80, function(){
		that.host = that.server.address().address;
		that.port = that.server.address().port;
		console.log("listen on host:  %s, port: %s", that.host, that.port);
	});

	// when drone info is broadcast we save data in here
	this.eventEmitter.on('droneinfo', this.saveDroneInfo);
	//this.eventEmitter.emit('droneinfo');
	

}



// Responsible for sending main page, css, images
_webserver.prototype.registerRequests = function (){

	//Handle image requests
	var that = this;

	this.app.use('/images/',function (req, res){
		res.sendFile('html/'+req.originalUrl , {"root": __dirname});
		console.log("Network: ( image ) :\t"+res.connection.remoteAddress+ "\t|(inbound)");
	});


	//Handle css requests
	this.app.use('/css/',function (req, res){
		res.sendFile('html'+req.originalUrl , {"root": __dirname});
		console.log("Network: ( css ) :\t"+res.connection.remoteAddress+ "\t|(inbound)");
	});

	this.app.use('/movelocation/', function (req, res){
		if (req.method == 'POST'){
			var targetlocation = req.originalUrl.toString().substring(14, req.originalUrl.length);
			that.requestNavigationSpot(targetlocation);
			console.log("Network: ( drone movement-"+targetlocation+")" + ":\t"+res.connection.remoteAddress+ "\t|(inbound)");
		}

	});

	// /
	this.app.use('/mode/', function (req, res) {

	});

	this.app.use('/realtime/', function (req, res){

		
		if (debug ){
			that.droneinfo.latitude = 33.775635 +Math.random()*0.0002;
			that.droneinfo.longitude = -84.3974969999999+ Math.random()* 0.0002;
			that.droneinfo.battery = 0.4+Math.random()*0.5;
		}

		res.send ( that.droneinfo );
		console.log("Network: ( drone info update )");
	});

	//Handle main page request
	this.app.use('/',function (req, res){
		console.log("Network: ( html ) :\t"+res.connection.remoteAddress+ "\t|(inbound)");
		res.sendFile ( 'html/andrew.html' , {"root": __dirname});
	});


}



// saves the information that the drone will be transmitting to web
// need to decide what to get
// maybe get more fields (it's cool !)
_webserver.prototype.saveDroneInfo = function ( ){
	if (this.gps !=undefined ){
		this.droneinfo.latitude = this.gps.getLatitude();
		this.droneinfo.longitude = this.gps.getLongitude();
		this.droneinfo.battery = this.gps.getBattery();
		this.droneinfo.orientation = this.gps.getOrientation();
	}

}

// specifies that the user has asked to change the mode to a particular state
// states: 'follow', 'navigation', 'info'
// return true if successful state change request, false if unsuccessful 
// a successful state change request does not mean the state changes
_webserver.prototype.changeMode = function ( state ){
		if (state == 'follow' || state == 'navigation' || state =='info'){
			this.eventEmitter.emit('web:dronestate:'+state);
			return true;
		}else{	
			return false;
		}

}

// requests navigation to target location
// target location : I think GPS coordinates but we should map it to klaus
// assume this will be a name ('Klaus, SC etc' )

_webserver.prototype.requestNavigationSpot = function ( targetlocation ){

	//@TODO
	// check to make sure target location is a valid location

	//only pass on if in navigation mode
	if (this.mode = 'navigation'){
			this.eventEmitter.emit('navigation:'+targetlocation);
	}
}






