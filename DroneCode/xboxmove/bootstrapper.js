//@TODO:  3 functions (removePub, removeSub, toString)
//@TODO:  Testing

/**
	This is the Main bootstrapper.  This is how communication happens between classes
	Communication happens with topics.  You subscribe or publish to a topic.
	This means classes are loosely coupled. 
	If you a subscribed, you will receive all info.  If you are publishing, you append to whatever
	everyone else is appending to


	**/  


function _topic(){
	this.publishers = new Array();
	this.subscribers = {};
	this.name;
	this.content = null;
	this.contentGuardian = null;	// content guardian is the publisher may modify the topic
}


//constructor
// topics.publishers = list of publishers for the topic
// topics.subscribers=  list of subscribers for the topic
function _bootstrapper(){
	this.topics = {};
}



///////////////////////Adding, removing publishers/subscribers to topic///////////////////////////////////////////////////


//add a publisher to the topic.  If topic is not defined, create it
_bootstrapper.prototype.addPublisherToTopic = function (topic, publisher){

	//if the topic is undefined we create it
	if (this.topics[topic] == undefined){
		//console.log("the topic is undefined");
		var topicToAdd = new _topic();
		topicToAdd.publishers.push(publisher);
		topicToAdd.name = topic;
		this.topics[topic] = topicToAdd;
	}
	// else we append it top the publisher list 
	else{
		this.topics[topic].publishers.push(publisher);
	}
}

//@TODO
// removes the publisher from the topic, if the topic doesn't exist throw and error (bcz its probably typo)
_bootstrapper.prototype.removePublisherFromTopic = function (topic, publisher){

}


//add a subscriber to the topic.  If topic is not defined, create it. 
_bootstrapper.prototype.addSubscriberToTopic = function (topic, subscriber){
	//if the topic is undefined we create it a
		if (this.topics[topic] == undefined){
			//console.log("the topic is undefined");
			var topicToAdd = new _topic();
			topicToAdd.subscribers[subscriber] = true;	// true because we haven't read anything (could be false technically)
			topicToAdd.name = topic;
			this.topics[topic] = topicToAdd;
		}
	// else we append it top the subscriber list 
	else{
		this.topics[topic].subscribers[subscriber] = true;
	}
}

//@TODO
_bootstrapper.prototype.removeSubscriberFromTopic = function (topic, subscriber){

}


////////////////////////////////////////CONTROLLING DATA///////////////////////////
// yes, you can totally input lies for parameters and get other people to release their locks, so what big deal want to fight?
// i mean its fucking javascript.  Everything is public anyway unless you get all ghetto.  Just use this shit.  It's for us


// gets the content lock so you can modify the content by calling modifyTopicContent
// returns true if the lock is gotten, false other
_bootstrapper.prototype.acquireContentLock = function (topic, publisher){
	if (this.topics[topic].contentGuardian == null || this.topics[topic].contentGuardian == publisher){
		this.topics[topic].contentGuardian = publisher;
		return true;
	}else{
		return false;
	}

}

_bootstrapper.prototype.releaseContentLock = function (topic, publisher){
	if (this.topics[topic].contentGuardian == publisher){
		this.topics[topic].contentGuardian = null;
		return true;
	}else{
		return false;
	}
}

// modify the content topic
// must be the publisher who is the content guardian. 
// modes: set ( the topic content is set to this field) , append (add to the end (simple string concat))
// returns true if modified successfully
_bootstrapper.prototype.modifyTopicContent = function (topic, publisher, content){
	if (this.topics[topic].contentGuardian != publisher){
		return false;
	}

	this.topics[topic].content = content;

	var subscriberKeys = Object.keys(this.topics[topic].subscribers);
	
	for (var key in subscriberKeys){
		this.topics[topic].subscribers[key] = true;			// mark new content for each subscriber
	}

	return true;
}

_bootstrapper.prototype.isNewTopicContent = function (topic, subscriber){
	return this.topics[topic].subscribers[subscriber];
}

_bootstrapper.prototype.readTopicContent = function (topic, subscriber){
	this.topics[topic].subscribers[subscriber] = false;
	return this.topics[topic].content;
}













//boot.publishers["a"] = 4;
//boot.publishers["b"] = 5;
//console.log(Object.keys(boot.publishers));

