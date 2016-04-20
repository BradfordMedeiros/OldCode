

var arDrone = require('ar-drone');
var cv = require('opencv');
var fs = require('fs');

console.log('Connecting png stream ...');
var stream = arDrone.createUdpNavdataStream();

var client = arDrone.createClient();
var pngStream = client.getPngStream();
var processingImage = false;
var lastPng;
var navData;


pngStream.on('error', console.log).on('data', function(pngBuffer) {
//console.log("got image");
	console.log("png set");
	lastPng = pngBuffer;
});



var detectFaces = function(){
//console.log("detect faces called");
//if( ! flying ) return;
	if( ( ! processingImage ) && lastPng )
	{
		processingImage = true;

		cv.readImage( lastPng, function(err, im) {
			var opts = {};
			im.detectObject(cv.FACE_CASCADE, opts, function(err, faces) {
				var face;
				var biggestFace;

		    //console.log("face detected\n");
		    
			
			
			processingImage = false;
			//im.save('/tmp/salida.png');
		}, opts.scale, opts.neighbors, opts.min && opts.min[0], opts.min && opts.min[1]);	// end cv.readimage
	});
	};
};


var faceInterval = setInterval( detectFaces, 150);



client.on('navdata', function(navdata) {
	navData = navdata;
})


