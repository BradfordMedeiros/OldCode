var fss = require("fs");

function read(f){
	return fss.readFileSync(f).toString();
}

function include(f){
	eval.apply(global,[read(f)]);
}

//////////////////////////////////////////////////////
include('bootstrapper.js');

function _test(){
	var a = new _bootstrapper();

}