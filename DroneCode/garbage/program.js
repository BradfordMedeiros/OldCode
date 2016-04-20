

//function is assignment to a variable something = function(){

function _test()  {
	this.field =  2;
}



Function.prototype.method = function(name, func){
	if (!this.prototype[name]){
			this.prototype[name] = func;
	}
	return this;
}
_test.method('print',function(){
	document.writeln("go");
});

t = new _test();



t.print();
document.writeln("hello");
//everything is passed around by reference
/*var stooge;
var x = stooge;

//object example
var flight= {

	status: {
		"one": 2,
		two: undefined,
	},
	word: 816,
	"airline":815
	//"airline2": 816;
	//city = {
	//	city: 2;
	//	city2: 1;
	//}
};

var stuff = {};
stuff.double = function(){
	var x = 3;
	var helper = function(){
		return x;
	};
	return helper();
};



flight.model = "big model";
document.writeln(stuff.double());
*/
