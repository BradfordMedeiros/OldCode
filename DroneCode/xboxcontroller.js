//@TODO:  Everything
//@TODO:  Testing
//@TODO:  Documentation

/**
	This is the gps module.  It should publish to location.  subscribe to nothing
	Just placeholder code for now

	**/

//CONFIGURATION
var VERBOSE = false;

//GLOBAL VARIABLES
var mapverbose = {

}

function _xboxcontroller(bootstrapper, xbox) {
    //this.xbox = require('node-xboxdrv');

    this.map = {};
    this.xbox = xbox;
    options = {
        type: 'xbox360',
        deadzone: 4000
    };
    var controller = new this.xbox('045e', '028e', options);

    var that = this;
    this.name = "_xboxcontroller";
    bootstrapper.addPublisherToTopic("location", this); // fix this

    //var buttonmap = new Array();

    controller.on('x', function() {
        //callFunctionOnPress('home');
        if (VERBOSE && mapverbose['x']) {
            console.log('x');
        }

        that.callFunctionOnPress('x', undefined);

    });

    controller.on('y', function() {
        //callFunctionOnPress('home');
        if (VERBOSE && mapverbose['x']) {
            console.log('y');
        }

        that.callFunctionOnPress('y', undefined);

    });

    controller.on('leftBumper', function() {
        //callFunctionOnPress('home');
        if (VERBOSE && mapverbose['leftBumper']) {
            console.log('leftBumper');
        }

        that.callFunctionOnPress('leftBumper', undefined);

    });

    controller.on('rightBumper', function() {
        //callFunctionOnPress('home');
        if (VERBOSE && mapverbose['rightBumper']) {
            console.log('rightBumper');
        }

        that.callFunctionOnPress('rightBumper', undefined);

    });
    controller.on('rightTrigger', function(data) {
        //callFunctionOnPress('rightTrigger', data);
        if (VERBOSE && mapverbose['rightTrigger']) {
            console.log('right trigger');
        }

        that.callFunctionOnPress('rightTrigger', data);
        //console.log(data);
    });

    controller.on('rightX', function(data) {
        if (VERBOSE && mapverbose['rightX']) {
            console.log('rightX');
        }

        that.callFunctionOnPress('rightX', data);

    });

    controller.on('leftX', function(data) {
        if (VERBOSE && mapverbose['leftX']) {
            console.log('leftX');
        }
        that.callFunctionOnPress('leftX', data);

    });

    controller.on('leftY', function(data) {
        if (VERBOSE && mapverbose['leftY']) {
            console.log('leftY');
        }
        that.callFunctionOnPress('leftY', data);

    });

    controller.on('rightY', function(data) {
        if (VERBOSE && mapverbose['rightY']) {
            console.log('rightY');
        }
        that.callFunctionOnPress('rightY', data);

    });

}


_xboxcontroller.prototype.callFunctionOnPress = function(button, data) {
    //if (this.map[button]== undefined || this.map[button].){
    //	return;
    //}

    // NEEED TO CHECK IF IN THE VALID RANGE
    // NEED TO CREATE A BETTER MAPPING SOLUTION TO HANDLE THE MULTIPLE RANGES


    var index = -1;
    var buttonmap = this.map[button];
    if (buttonmap == undefined) { // if the button is not mapped to any range return
        return;
    }


    var lowrange = buttonmap.rangelowArray;
    var highrange = buttonmap.rangehighArray;
    var lastclicked = buttonmap.lastclickedArray;
    var rates = buttonmap.rateArray;

    if (VERBOSE && mapverbose[button]) {
        console.log(button + ":\tTESTING VALUES");
    }

    var currtime = new Date();
    for (var i = 0; i < lowrange.length; i++) {
        var time = currtime.getTime();
        var timePass = (time - lastclicked[i] > rates[i]);
        if (((data == undefined) || (data >= lowrange[i] && data <= highrange[i])) && timePass) { //&&  (this.date.getTime()- lastclicked[i] > rate)    ) {
            //console.log("should call");
            buttonmap.funcArray[i]();
            lastclicked[i] = currtime.getTime();
            //incremenet plast clicked
        } else if (VERBOSE && mapverbose[button]) {
            console.log("\n" + button + " : fails conditions\n");
            var p_low = (data >= lowrange[i]);
            var p_high = (data <= highrange[i]);
            var p_time = (time - lastclicked[i] > rates[i]);

            console.log("data:  " + data + "\n");
            console.log("lowrange[i]" + lowrange[0] + "  passed?: " + p_low);
            console.log("highrange[i]" + highrange[0] + " passed?:  " + p_high);
            console.log("passed rate?:  " + timePass);
            console.log("lastclicked[i]: " + lastclicked[i]);
            console.log("time is:   " + time);
            console.log("rates[i]:   " + rates[i]);

        }
    }

    /*r rate = this.map[button].rate;
    var func = this.map[button].func;
    var lastclicked = this.map[button].lastclicked;
    if (this.date.getTime()- lastclicked > rate){
    	this.map[button].lastclicked = this.date.getTime();
    	func();
    }*/

}




// when the analog stick goes above a certain range call the function
// rate is the difference in milliseconds that need to pass before calling the function again
//variable arguements

_xboxcontroller.prototype.addFunctionToMapping = function(stick, func, rate, rangelow, rangehigh) {
    /*if (stick == "right"){
    	console.log("ADD FUNCTION TO RIGHT ANALOG");
    	func();
    }else if (stick == "left"){
    	console.log("ADD FUNCTION LEFT ANALOG");
    	func();
    }*/

    //throw "hello";

    if ((arguments.length - 1) % 4 != 0) {
        console.log("i wanted to throw an exception here but im confused how to ");
        console.log("ERRRROR  INVALID INVALID_NUM_ARG_EXCEPTION");

        //var exception= {
        //	error: "INVALID_NUM_ARG_EXCEPTION"
        //details: "You provided "+ arguments.length+ "number of arguements expected a 2+3k number of arguments"
        //}
    }

    mapverbose[stick] = true;

    if (this.map[stick] == undefined) {
        this.map[stick] = {
            //func: func,
            funcArray: new Array(),
            rateArray: new Array(),
            //rate: rate != undefined ? rate: Infinity,
            rangelowArray: new Array(),
            rangehighArray: new Array(),
            lastclickedArray: new Array()

            //angehigh
            //astclicked: this.date.getTime(),
            //heckrange: (rangelow != undefined || rangehigh !=undefined) ? true: false
        }

    }

    for (var i = 1; i < arguments.length; i = i + 4) {

        /*this00.map[stick].rangelowArray.push(rangelow !=undefined ? rangelow: -Infinity);
        this.map[stick].rangehighArray.push(rangehigh !=undefined ? rangehigh: Infinity);
        this.map[stick].lastclickedArray.push(this.date.getTime());
        */


        ////FINISH THIS SO YOU PROPERLYU MAP TO THE ARRAY

        var currTime = new Date();
        this.map[stick].funcArray.push(arguments[i]);
        this.map[stick].rateArray.push(arguments[i + 1]);
        this.map[stick].rangelowArray.push(arguments[i + 2] != undefined ? arguments[i + 2] : -Infinity);
        this.map[stick].rangehighArray.push(arguments[i + 3] != undefined ? arguments[i + 3] : Infinity);
        this.map[stick].lastclickedArray.push(currTime.getTime());
    }




}




_xboxcontroller.prototype.getLocation = function() {
    console.log("print test\n");
}