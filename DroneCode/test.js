var fs = require('fs');
var path = require('path');
//var df = require('dateformat')

var keypress = require('keypress');
keypress(process.stdin);

process.stdin.on('keypress', function(ch, key) {
    console.log("KEY CALLED");
    console.log("===========================rotation")
    console.log(key.name);
    if (key.name == 't') {
        takeoff();
    } else if (key.name == 'l') {
        land();
    } else if (key.name == 'r') {
        rotate();
    } else if (key.name == 'f') {
        goforward();
    } else if (key.name == 'd') {
        dance();
    }
})

/////////////
var arDrone = require('ar-drone')
var arDroneConstants = require('ar-drone/lib/constants')
var autonomy = require('ardrone-autonomy');
var client = arDrone.createClient();
var ctrl = new autonomy.Controller(client, {
    debug: false
});
//var repl = client.createRepl();
function navdata_option_mask(c) {
    return 1 << c;
}
// From the SDK.
var navdata_options = (
    navdata_option_mask(arDroneConstants.options.DEMO) | navdata_option_mask(arDroneConstants.options.VISION_DETECT) | navdata_option_mask(arDroneConstants.options.MAGNETO) | navdata_option_mask(arDroneConstants.options.WIFI)
);
// Connect and configure the drone
client.config('general:navdata_demo', true);
client.config('general:navdata_options', navdata_options);
client.config('video:video_channel', 1);
client.config('detect:detect_type', 12);
// Add a ctrl object to the repl. You can use the controller
// from there. E.g.
// ctrl.go({x:1, y:1});
//
//repl._repl.context['ctrl'] = ctrl;

var takeoff = function() {
    console.log("takeoff called");
    client.takeoff();
    ctrl.hover();

}

var land = function() {
    console.log("land called");

    client.land();
}

var rotation = 30;

var count = 0;
var rotate = function() {
    ctrl.zero();
    ctrl.go({
        yaw: rotation
    }, function() {
        ctrl.hover();

        setTimeout(function() {
            count++;
            if (count < 10) {
                console.log("rotation num:  " + count);
                rotate();
            }
        }, 2000);


    });

    rotation = rotation + 80;
}


var distance = 0.5;
var goforward = function() {
    ctrl.zero();
    if ((Math.floor(Math.random() * 10) + 1) > 5) {
        ctrl.go({
            x: distance
        }, function() {
            ctrl.hover();
            distance = distance * -1;
        });
    } else {
        rotate();
    }


}