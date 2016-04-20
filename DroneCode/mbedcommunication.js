//createConnection();

var createConnection = function(stufftosay) {








    serialport.myPort = new serialport.SerialPort("/dev/ttyO3", {
        parser: serialport.parsers.raw,
        baud: 9600

    })
    return serialport.myPort;
    //   serialport.myPort.message = stufftosay;
    //  serialport.myPort.write(stufftosay);
    //  serialport.myPort.message = stufftosay;
}

var port = createConnection();
//writeStuff('hello');
//writeStuff("who are you");
//writeStuff("wait                who am i");

//for(var i = 0 ;i <100;i++){
//	console.log(i);
//}
//createConnection("2: I go to Georgia Tech");
//createConnection("3: hello elayne");


//serialport.myPort.write("two muthafucker");

//createConnection("2: fuck you work you slut ");
//createConnection("3:  yo dog");

canwrite = false;
writeArray = new Array();
var writeStuff = function(phrase) {
    if (!canwrite) {
        writeArray.push(phrase);
    } else {
        console.log("should talk now");
        if (phrase != undefined) {
            writeArray.push(phrase);
        }

        for (var i = 0; i < writeArray.length; i++) {
            console.log(writeArray[i]);
            port.write(writeArray[i] + '\0');
        }
        writeArray = new Array();
    }
}

console.log("start write ...");
serialport.myPort.on('open', function(chunk) {
    console.log("PORT OPENED");

    //	console.log("message:  ", serialport.message);
    //      serialport.myPort.write(serialport.myPort.message+'\0');


    //	serialport.myPort.close();
    canwrite = true;
    writeStuff();
})

serialport.myPort.on('close', function() {
    console.log("PORT CLOSED");
});


writeStuff("Im a bro");
setTimeout(function() {
    writeStuff("go man");
    setTimeout(function() {
        writeStuff("nah just kidding");
    }, 5000);

}, 3000);



//writeStuff("go man");


//writeStuff("just kidding stop");



//serialport.write("Hello Caleb\0");
//createConnection ("hello world");
//createConnec
//console.log("end");