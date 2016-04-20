//@TODO:  Everything
//@TODO:  Testing

/**
	This is the node generator module. It should publish to map, subscribe to controls


	**/  



function _node(){
	this.gpslocation = null;
	this.neighborNodes = new Array();
}

function _nodegenerator(bootstrapper){
	this.name = "nodegenerator";
	bootstrapper.addPublisherToTopic("map", this);
	bootstrapper.addSubscriberToTopic("controls", this);
}

_nodegenerator.prototype.generateNode = function(){
	
}

_nodegenerator.prototype.saveNodeConfiguration = function(){

}

_nodegenerator.prototype.loadNodeConfiguration = function(){

}

_nodegenerator.prototype.visualizeNodes = function(){

}