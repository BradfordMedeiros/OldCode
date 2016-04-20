
//

__path_people_classifier = 'xmlfiles/haarcascade_upperbody.xml'
DRAW_OUTLINES_AND_SAVE = true;
IMAGE_OUTPUT_PATH = './visionimages/output.png'
IMAGE_OUTPUT_PATH1 = './visionimages/output1.png'

BLACKFILTER = {};
BLACKFILTER.WIDE = {};
BLACKFILTER.MEDIUM = {};
BLACKFILTER.NARROW = {};

BLACKFILTER.WIDE.LOWER = [0, 0, 0];
BLACKFILTER.WIDE.UPPER = [ 52, 52, 52];

BLACKFILTER.MEDIUM.LOWER = [0, 0 , 0];
BLACKFILTER.MEDIUM.UPPER = [ 20, 20, 20];

BLACKFILTER.NARROW.LOWER = [ 0 , 0 , 0];
BLACKFILTER.NARROW.UPPER = [ 10, 10, 10];


function _vision ( opencv, client, stream, eventEmitter){
	

	this.name = "vision";
	this.opencv = opencv;
	this.client = client;
	this.isOnFaceDetection = false;
	this.isOnPersonDetection = false;
	this.isOnColorDetection = false;
	this.eventEmitter = eventEmitter;

	// this line might create conflicts maybe
	this.stream =  stream;

	this.pngStream = client.getPngStream();

	//console.log("pngstream:  "+this.pngStream);
	this.processingImageF = false;
	this.processingImageP = false;
	this.processingImageC = false;


	this.lastPng;
	this.navData;

	var that = this;
	this.startTime  = new Date().getTime();

	this.pngStream.on('data', function (pngBuffer){

		that.lastPng = pngBuffer;
		eventEmitter.emit("camera",pngBuffer);
	});

	this.client.on('navdata', function (navdata){
		that.navData = navdata;
	})

	//this.averageDetection();

	//this.startDetectingFaces();

}


// should pass in a referece to vision because i don't get node lol
// will learn formally later.  Sucks
_vision.prototype.startDetectingFaces = function ( that ){
		
	followmode.move.control.disable();

	console.log("EVENT:  vision: Facial Detection turned on");
	if (!that.isOnFaceDetection){
		that.faceDetectIntervalHandle = setInterval(function(){that.detectFaces(that)}, 150);

	}
	that.isOnFaceDetection = true;
}


_vision.prototype.stopDetectingFaces = function ( that ){
	console.log("EVENT:  vision: Facial Detection turned off");
	if (that.isOnFaceDetection){
		clearInterval(that.faceDetectIntervalHandle);
	}
	that.isOnFaceDetection = false;
}



/**
	Still need to think about where to put the facial detection data

**/
_vision.prototype.detectFaces  = function ( that ){

	if( ( ! that.processingImageF ) && that.lastPng )
	{
		//console.log("detecting");
		that.processingImageF = true;

		that.opencv.readImage( that.lastPng, function(err, im) {
			var opts = {};
			im.detectObject(that.opencv.FACE_CASCADE, opts, function(err, faces) {
				var face;
				var biggestFace;
				var biggestArea = 0; 

		    	//console.log("number of faces detected:  "+faces.length);
		    	if (DRAW_OUTLINES_AND_SAVE){
		    		im.save(IMAGE_OUTPUT_PATH)

		    	}

				if (faces.length > 0){

    				for (var i = 0; i<faces.length; i++){
        				var face = faces[i];
        				im.ellipse(face.x + face.width /2 , face.y + face.height/2, face.width/2, face.height/2);
        				if (face.width * face.height > biggestArea){
        					biggestFace = face;
        				}
    				}

    				
//);
					//console.log("# faces detected:  "+faces.length);
					//eventEmitter.emit('vision:facedetected', biggestFace, im);
					followmode.follow(biggestFace, im, 'face');
					if (DRAW_OUTLINES_AND_SAVE){
		    			im.save(IMAGE_OUTPUT_PATH1);

		    		}
				}




			
			
			that.processingImageF = false;
			//im.save('/tmp/salida.png');
		}, opts.scale, opts.neighbors, opts.min && opts.min[0], opts.min && opts.min[1]);	// end cv.readimage
	});
	};
}


_vision.prototype.startDetectingPeople = function ( that ){
	console.log("EVENT:  vision: Person Detection turned on");
	followmode.move.control.disable();

	if (!that.isOnPersonDetection){
		that.peopleDetectIntervalHandle = setInterval(function(){that.detectPeople(that)}, 150);

	}
	that.isOnPersonDetection = true;

}

_vision.prototype.stopDetectingPeople = function ( that ){
	console.log("EVENT:  vision: Person Detection turned off");
	if (that.isOnPersonDetection){
		clearInterval(that.peopleDetectIntervalHandle);
	}
	that.isOnPersonDetection = false;

}




_vision.prototype.detectPeople = function ( that ){

	//console.log("detect people");

	if( ( ! that.processingImageP ) && that.lastPng )
	{

		//console.log("detecting");
		that.processingImageP = true;


		that.opencv.readImage( that.lastPng, function(err, im) {

			var opts = {};
			im.detectObject(__path_people_classifier, opts, function(err, faces) {
				var face;
				var biggestFace = 0;
				var biggestArea = 0;


		    	//console.log("number of faces detected:  "+faces.length);
		    	if (DRAW_OUTLINES_AND_SAVE){
						im.save(IMAGE_OUTPUT_PATH);
		    		
		    		}
				if (faces.length > 0){

					 for (var i = 0; i<faces.length; i++){
        				var face = faces[i];
        				im.ellipse(face.x + face.width /2 , face.y + face.height/2, face.width/2, face.height/2);

        				if (face.width * face.height > biggestArea){		// gets the biggest face
        					biggestFace = face;
        				}
    				}

					that.eventEmitter.emit('vision:persondetected', biggestFace, im);

					if (DRAW_OUTLINES_AND_SAVE){
						im.save(IMAGE_OUTPUT_PATH1);
		    		
		    		}

				}


			
			
			that.processingImageP = false;
			//im.save('/tmp/salida.png');
		}, opts.scale, opts.neighbors, opts.min && opts.min[0], opts.min && opts.min[1]);	// end cv.readimage
	});
	};
}



_vision.prototype.startDetectingColor = function ( that ){
	followmode.move.control.disable();


	console.log("EVENT:  vision: Color Detection turned on");
	if (!that.isOnColorDetection){
		that.colorDetectIntervalHandle = setInterval(function(){that.detectColor(that)}, 250);

	}
	that.isOnColorDetection = true;

}

_vision.prototype.stopDetectingColor = function ( that ){
	console.log("EVENT:  vision: Color Detection turned off");
	if (that.isOnColorDetection){
		clearInterval(that.colorDetectIntervalHandle);
	}
	that.isOnColorDetection = false;

}


_vision.prototype.detectColor = function ( that ) {
	//console.log("detecting color");
	try{
	
	if( ( ! that.processingImageC ) && that.lastPng )
	{
		var filter = BLACKFILTER.NARROW;
		//sudo console.log("detecting");
		that.processingImageC = true;

		that.opencv.readImage( that.lastPng, function(err, im) {
			

			var originalIm = im.clone();
			//console.log(im);
			var opts = {};

			// this is what makes it good or shitty
		    //im.save(IMAGE_OUTPUT_PATH1);

			im.inRange(filter.LOWER, filter.UPPER);

			//im.save(IMAGE_OUTPUT_PATH1);

	//			

			var contours = im.findContours();
			if (contours.size() == 0){
				//console.log("WARNING:  no countours found");
				return;
			}

			//console.log("size:  "+contours.size());

			var contourFirst = contours.boundingRect(0);
			
			var maxIndex = 0;
			var maxArea = contourFirst.width * contourFirst.height;

			var currentContour;
			var currentArea;

			console.log("DETECT");
			// gets the max bounding box for the color
			for (var i = 0; i< contours.size(); i++){
				 currentContour = contours.boundingRect(i);
				 currentArea = currentContour.width * currentContour.height;
				// console.log("max area at " +i+" : "+currentArea);
				 if (currentArea > maxArea){
				 	maxArea = currentArea;
				 	maxIndex = i;
				 }

			}
			

			//console.log("max index:  "+ maxIndex);

			var maxContour = contours.boundingRect(maxIndex);
			//console.log("max :"+maxContour.width);
        	that.eventEmitter.emit('vision:colordetected', maxContour, im);

			followmode.follow(maxContour, im, 'color');


			if (DRAW_OUTLINES_AND_SAVE){
				originalIm.ellipse(maxContour.x + maxContour.width /2 , maxContour.y + maxContour.height/2, maxContour.width/2, maxContour.height/2);
				im.ellipse(maxContour.x + maxContour.width /2 , maxContour.y + maxContour.height/2, maxContour.width/2, maxContour.height/2);
				originalIm.save(IMAGE_OUTPUT_PATH);
				//console.log()
				im.save(IMAGE_OUTPUT_PATH1);
			}
        	

			//console.log("maxAreaRect:  "+contours.boundin
				// end cv.readimage



		});

		that.processingImageC = false;
	};
}catch (e){

}

}





