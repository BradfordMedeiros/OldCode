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
var detectFaces = function(){
//console.log("detect faces called");
//if( ! flying ) return;
if( ( ! processingImage ) && lastPng )
{
processingImage = true;
cv.readImage( lastPng, function(err, im) {
var opts = {};

im.detectObject('/home/samantha/Desktop/DroneCode/xmlfiles/haarcascade_upperbody.xml', opts, function(err, faces) {
var face;
var biggestFace;

    //console.log("face detected\n");
    console.log("number of faces detected:  "+faces.length);
if (faces.length >= 1){
    for (var i = 0; i<faces.length; i++){
        var face = faces[i];
        im.ellipse(face.x + face.width /2 , face.y + face.height/2, face.width/2, face.height/2);
    }
  // im.save('../../web\ code/yourpicture.png');
//);
}

for(var k = 0; k < faces.length; k++) {
face = faces[k];
if( !biggestFace || biggestFace.width < face.width ) biggestFace = face;
//im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], [0, 255, 0], 2);
}
if( biggestFace ){
face = biggestFace;
//console.log( face.x, face.y, face.width, face.height, im.width(), im.height() );
face.centerX = face.x + face.width * 0.5;
face.centerY = face.y + face.height * 0.5;
var centerX = im.width() * 0.5;
var centerY = im.height() * 0.5;
var heightAmount = -( face.centerY - centerY ) / centerY;
var turnAmount = -( face.centerX - centerX ) / centerX;
turnAmount = Math.min( 1, turnAmount );
turnAmount = Math.max( -1, turnAmount );
log( turnAmount + " " + heightAmount );
//heightAmount = Math.min( 1, heightAmount );
//heightAmount = Math.max( -1, heightAmount );
heightAmount = 0;
if( Math.abs( turnAmount ) > Math.abs( heightAmount ) ){
log( "turning "+turnAmount );
if( turnAmount < 0 ) client.clockwise( Math.abs( turnAmount ) );
else client.counterClockwise( turnAmount );
setTimeout(function(){
log("stopping turn");
client.clockwise(0);
//this.stop();
},100);
}
else {
log( "going vertical "+heightAmount );
if( heightAmount < 0 ) client.down( heightAmount );
else client.up( heightAmount );
	setTimeout(function(){
		log("stopping altitude change");
		client.up(heightAmount);
	},50);
	}
}
processingImage = false;
//im.save('/tmp/salida.png');
}, opts.scale, opts.neighbors
, opts.min && opts.min[0], opts.min && opts.min[1]);
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
client.after(600000, function() {
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
