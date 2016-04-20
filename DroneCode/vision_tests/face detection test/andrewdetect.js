var arDrone = require('ar-drone');
var cv = require('opencv');
var http = require('http');
var fs = require('fs');
console.log('Connecting png stream ...');
//var stream = arDrone.createUdpNavdataStream();
var client = arDrone.createClient();
var pngStream = client.getPngStream();
var processingImage = false;
var lastPng;
var navData;
var flying = false;
var startTime = new Date().getTime();
var log = function(s){
var time = ( ( new Date().getTime() - startTime ) / 1000 ).toFixed(2);
//console.log(time+" \t"+s);
}
pngStream
.on('error', console.log)
.on('data', function(pngBuffer) {
//console.log("got image");
lastPng = pngBuffer;
});

var exiting = false;
process.on('SIGINT', function() {
	if (exiting) {
		process.exit(0);
	} else {
		console.log('Got SIGINT. Landing, press Control-C again to force exit.');
		exiting = true;
		//___move.control().disable();
		//client.down(0.5);
		//setTimeout(function (){
			client.land();
		//},2000);

	}
});

var detectFaces = function(){
//console.log("detect faces called");
//if( ! flying ) return;
if( ( ! processingImage ) && lastPng ){
	processingImage = true;
	cv.readImage( lastPng, function(err, im) {
		var opts = {};

		im.detectObject(cv.FACE_CASCADE, opts, function(err, faces) {
			var face;
			var biggestFace;
			console.log("hello");

    		//console.log("face detected\n");
    		console.log("number of faces detected:  "+faces.length);
			

			for(var k = 0; k < faces.length; k++) {
				face = faces[k];
				if( !biggestFace || biggestFace.width < face.width ) biggestFace = face;
				//im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], [0, 255, 0], 2);
			}
			if( biggestFace ){

				var turned = false;
				face = biggestFace;
				//console.log( face.x, face.y, face.width, face.height, im.width(), im.height() );
				face.centerX = face.x + (face.width * 0.5);  // face.centerX = Center of Face detected - width
				face.centerY = face.y + (face.height * 0.5); // face.centerY = Center of Face detected - height
				var centerX = im.width() * 0.5;  // center of screen width
				var centerY = im.height() * 0.5; // center of screen height
				var heightAmount = -( face.centerY - centerY ) / centerY; // difference in face between center of face and center
				var turnAmount = -( face.centerX - centerX ) / centerX;   // float value
				turnAmount = Math.min( 1, turnAmount );
				turnAmount = Math.max( -1, turnAmount );
				log( turnAmount + " " + heightAmount );
				heightAmount = Math.min( 1, heightAmount );
				heightAmount = Math.max( -1, heightAmount );
				//heightAmount = 0;
				if( Math.abs( turnAmount ) ){
					turned = true;

					log( "turning "+turnAmount );
					if( turnAmount < 0 ) {
						client.clockwise( Math.abs( turnAmount ) );
					} else {
						client.counterClockwise( turnAmount );
					}
					setTimeout(function(){
						log("stopping turn");
						client.clockwise(0);
						//this.stop();
					},100);
				} 
				
					turned = true;
					log( "going vertical "+heightAmount );
					if( heightAmount < -0.3 ) {
						client.up(heightAmount);
					} else if (heightAmount > 0.3){
						client.up( heightAmount );
					}
					setTimeout(function(){
						log("stopping altitude change");
						client.up(heightAmount);
					},50);

				
			
//////////////// ANDREW STARTED HERE //////////////////////

// centre face algorithm
// inputs: face.centerX, face.centerY, centerX, centerY, and alpha
// INPUTS NEEDED
		var alpha = .1;
		var width_up = im.width*alpha + centerX;
		var height_up = im.height*alpha + centerY;
		var width_low = centerX - (im.width*alpha);
		var height_low = centerY - (im.height*alpha);
		var change_height;
		var change_width;

		// LEFT and RIGHT
		/*
		if (face.centerX > width_up) {
			//go right
			change_width = face.centerX - width_up;
			client.right(change_width);
		} else if  (face.centerX < width_low) {
			// go left
			change_width = width_low - face.centerX;
			client.left(change_width);
		}
	*/

			// RISE and FALL

	/*	if (face.centerY > height_up) {
			//lower
			console.log("something");
			change_height = face.centerY - height_up;
			client.down(change_height);
		} else if  (face.centerY < height_low) {
			// rise
			change_height = height_low - face.centerY;
			client.up(change_height);
		} */

		var IDEAL_AREA = (im.width()*im.height())*.015;
		var SAMPLE_AREA = (face.width * face.height);

		console.log("Sample area:  "+SAMPLE_AREA);
		console.log("ideal back   "+(IDEAL_AREA*1.20));
		console.log("ideal front  "+(IDEAL_AREA*0.80));

		if (true){


			if (SAMPLE_AREA > (IDEAL_AREA*1.20)) {
				console.log("going backward")
				client.front(-0.2);
				setTimeout (function (){
					client.front(0);
				}, 100);

			} else if (SAMPLE_AREA < (IDEAL_AREA*.80)) {
				console.log("going forward");
				client.front(0.2);
				setTimeout(function (){
					client.front(0);
				}, 100);
			}
		}

	}

	turned = false;
// BACKWARDS and FORWARDS



//////////////////////////////////////////////////////////////
		processingImage = false;
//im.save('/tmp/salida.png');
	}, opts.scale, opts.neighbors, opts.min && opts.min[0], opts.min && opts.min[1]);
});
};
};
var faceInterval = setInterval( detectFaces, 150);

console.log("gets here");
client.takeoff();
client.after(5000,function(){
log("going up");
this.up(0.5);
}).after(500,function(){
log("stopping");
this.stop();
flying = true;
});
client.after(60000, function() {
flying = false;
this.stop();
this.land();
});
client.on('navdata', function(navdata) {
navData = navdata;
})
var server = http.createServer(function(req, res) {
if (!lastPng) {
res.writeHead(503);
res.end('Did not receive any png data yet.');
return;
}
res.writeHead(200, {'Content-Type': 'image/png'});
res.end(lastPng);
});
server.listen(80, function() {
console.log('Serving latest png on port 8080 ...');
});
