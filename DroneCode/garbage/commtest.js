function _serial(){
	this.name = "serial";
	this.port = new serialport.SerialPort("/dev/tty03", {
		parser: serialport.parsers.raw,
		baud: 9600
	})

	this.port.write("hello world");
}