/**
Functions to interface w/ the MBED via serial connection located on the bottom of the drone.
**/

serialport=require('node-serialport')

var createConnection = function ( stufftosay ){
  
    serialport.myPort = new serialport.SerialPort("/dev/ttyO3",{
        parser: serialport.parsers.raw,
        baud: 9600

    })
    return serialport.myPort;

}

var port = createConnection();

canwrite = false;
writeArray = new Array();
var writeStuff = function ( phrase ){
	if (!canwrite){
		writeArray.push(phrase);
	}else{
		console.log("should talk now");
		if (phrase !=undefined){
			writeArray.push(phrase);
		}
		
		for (var i = 0; i <writeArray.length;i++){
			console.log(writeArray[i]);
			port.write(writeArray[i]+'\0');
		}
		writeArray = new Array();
	}     	
}

console.log("start write ...");
serialport.myPort.on('open', function(chunk){
   	console.log("PORT OPENED");

	canwrite= true;
	writeStuff();
})

serialport.myPort.on('close', function (){
	console.log("PORT CLOSED");
});


writeStuff("Im a bro");
setTimeout(function (){
	writeStuff("go man");
	setTimeout(function(){
		writeStuff("nah just kidding");
	}, 5000);

}, 3000);


