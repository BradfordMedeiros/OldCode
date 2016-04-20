FOLLOW_VERBOSE = false;

/**
    Given a move instance from the AR DRONE this function launches and implements follow mode
**/
function _followmode(move, eventEmitter) {

    var that = this;
    this.move = move;
    this.client = move.client;

    this.eventEmitter = eventEmitter;
    this.turning = false;

    console.log("INIT: follow mode");


    this.TYPE = {};
    this.TYPE.face = {};
    this.TYPE.color = {};

    this.TYPE.face.max = 1.2;
    this.TYPE.face.min = 0.8;

    this.TYPE.color.max = 9; // if > this number, move back
    this.TYPE.color.min = 5; // if < this number, move forward

    this.move.control.zero();
    this.move.control.disable();
    var hasSeen = false;

    var log = function() {
        console.log("oh")
    }
}


_followmode.prototype.follow = function(face, im, type) {

    this.client.clockwise(0);
    hasSeen = true;
    var that = this;
    this.turning = true;
    var client = this.client;

    face.centerX = face.x + (face.width * 0.5); // face.centerX = Center of Face detected - width
    face.centerY = face.y + (face.height * 0.5); // face.centerY = Center of Face detected - height
    var centerX = im.width() * 0.5; // center of screen width
    var centerY = im.height() * 0.5; // center of screen height
    var heightAmount = -(face.centerY - centerY) / centerY; // difference in face between center of face and center
    var turnAmount = -(face.centerX - centerX) / centerX; // float value
    turnAmount = Math.min(1, turnAmount);
    turnAmount = Math.max(-1, turnAmount);
    heightAmount = Math.min(1, heightAmount);
    heightAmount = Math.max(-1, heightAmount);


    if (Math.abs(turnAmount)) {
        turned = true;

        if (turnAmount < 0) {
            client.clockwise(Math.abs(turnAmount));
        } else {

            client.counterClockwise(turnAmount);
        }
        setTimeout(function() {
            client.clockwise(0);
        }, 100);
    }

    turned = true;
    if (heightAmount < -0.3) {

        client.up(heightAmount);
    } else if (heightAmount > 0.3) {
        client.up(heightAmount);
    }
    setTimeout(function() {
        client.up(0);
    }, 50);



    var alpha = .1;
    var width_up = im.width * alpha + centerX;
    var height_up = im.height * alpha + centerY;
    var width_low = centerX - (im.width * alpha);
    var height_low = centerY - (im.height * alpha);
    var change_height;
    var change_width;

    var type;
    if (type == 'color') {
        type = this.TYPE.color;
    } else if (type == 'face') {
        type = this.TYPE.face;
    }

    var min = type.min;
    var max = type.max;

    var IDEAL_AREA = (im.width() * im.height()) * .015;
    var SAMPLE_AREA = (face.width * face.height);

    if (FOLLOW_VERBOSE) {
        console.log("Sample area:  " + SAMPLE_AREA);
        console.log("ideal back   " + (IDEAL_AREA * max));
        console.log("ideal front  " + (IDEAL_AREA * min));

    }

    if (SAMPLE_AREA > (IDEAL_AREA * max)) {
        if (FOLLOW_VERBOSE) {
            console.log("going back");
        }

        client.front(-0.3);

        setTimeout(function() {
            client.front(0);
            that.turning = false;

            if (FOLLOW_VERBOSE) {
                console.log("following finished");
            }


        }, 100);

    } else if (SAMPLE_AREA < (IDEAL_AREA * min)) {
        if (FOLLOW_VERBOSE) {
            console.log("going forward");
        }
        client.front(0.3);
        setTimeout(function() {
            client.front(0);
            if (FOLLOW_VERBOSE) {
                console.log("following finished");

            }
            that.turning = false;

        }, 100);
    }




}