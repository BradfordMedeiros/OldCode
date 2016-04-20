function _pathfinder ( gps , xls){
	this.name = "pathfinder";
	this.gps = gps;
	//this.currentDestination = 'Culc';
	//this.currentOrigin = 'SC';

	this.currentDestination = undefined;
	this.currentOrigin = undefined;
	this.MAX_RADIUS_OFFSET = 10;  // max number of meters before going back to closest node
	this.MAX_NODE_RETURN = 7;    // max number of times we will go back to node (not the distance)
	this.KILL_IF_EXCEED_RETURN = true;
	this.XLS = xls;
	this.readFile();
	this.campusMap = this.createGraph();
	
	//this.shortestPath = this.campusMap.shortestPath(this.currentOrigin, this.currentDestination).concat([this.currentOrigin]).reverse();
	//console.log("Init shortestPath: " + this.shortestPath);
	this.attempts = 0;
	this.globalAttempts = 0;
	//fill in anything you need to make the pathfinder here
	//Precompute dijkstras here
}
	

// maybe offer a list of possible destinations we could go to?  It would be nice for dynamicism 
_pathfinder.prototype.getDestinationList = function ( ){
	return _pathfinder.nodeName;
}

_pathfinder.prototype.getDest = function(){
	var last = this.shortestPath.length-1;
	return this.shortestPath[last];
}

_pathfinder.prototype.setDestination = function ( destination_name, currentgps ){

	var currentLon;
	var currentLat;
	if (currentgps !=undefined ){
		currentLon = this.gps.getLongitude(currentgps.longitude);
		currentLat = this.gps.getLatitude(currentgps.latitude);
	}else{
		currentLon = this.gps.getLongitude();
		currentLat = this.gps.getLatitude();
	}
	
	if (currentLon == undefined || currentLat == undefined){
		console.log("ERROR: NO GPS DATA");
		return -3;
	}
	var current_name = getClosestNode(currentLat, currentLon);
	console.log("current name is :  "+current_name);
	this.currentDestination = destination_name;
	// gps.getL
	this.shortestPath = this.campusMap.shortestPath(current_name, this.currentDestination).concat([current_name]).reverse();
	this.attempts = 0;
	//console.log(this.shortestPath);
}


	// get current location through this.gps.getNode --> has longitude and latitude
	// or equivalent this.gps.getLatitude() or Longitude() -- same shit

	// Step 1:  Get Current gps latitude and longitude
	// Step 2:  Identify closest node
	// Step 3:  If current node with this.MAX_RADIUS OFFSET we go to next node 
				//else we fly back to the closest node. Fly back a total of this.MAX_NODE_RETURN times
	// Step 4:  When at current node go to next node according to precomputed dijaskstras
			//** Look at what my destination actually is now --> in this.currentDestination
			//if (destination_name not in list) --> console.log(ERROR:  etc return -1 )
	// Step5:  return GPS coordinates of next node 
	// var node = {};  node.latitude = x;  node.longitude = y;
	// **MUST BE THIS FORMAT **
	


_pathfinder.prototype.getNextNode = function ( lat, lon ) {
	console.log(this.currentDestination);
	if (this.currentDestination == undefined){
		console.log("ERROR:  destination not defined");
		return -1;
	}else{
		console.log("destination defined");
	}
	var currentLat = this.gps.getLatitude(lat);
	var currentLon = this.gps.getLongitude(lon);
	var next = {};
	var closestNode = getClosestNode(currentLat, currentLon)[0];
	var closestDist = getClosestNode(currentLat, currentLon)[1];
	console.log("closest Node: " + closestNode);
	console.log("closest Dist: " + closestDist);
	if (isOnTrack(closestNode,this.shortestPath)){ // if closestNode is along the computed path
		if (closestDist <this.MAX_RADIUS_OFFSET && closestNode == this.currentDestination){
			console.log("Dest Reached!");
			return 0; 
		}
		if (closestDist < this.MAX_RADIUS_OFFSET){ // if closestNode is within threshold
			nextNode = getNextPathNode(closestNode,this.shortestPath);
			this.attempts = 0;
		}
		else if (this.attempts<this.MAX_NODE_RETURN){
			nextNode = closestNode;
			this.attempts++;
			console.log("atempt: " + this.attempts);
		}
		else if (this.attempts>=this.MAX_NODE_RETURN){
			return -1;
		}
	}
	else{ // not on the track anymore
		this.shortestPath = this.campusMap.shortestPath(closestNode, this.currentDestination).concat([closestNode]).reverse();
		console.log("New Track: shortest path: " + this.shortestPath);
		this.globalAttempts++;
		if (this.globalAttempts > this.MAX_NODE_RETURN){
			return -1;
		}
		else if (closestDist < this.MAX_RADIUS_OFFSET){ // if closestNode is within threshold
			nextNode = getNextPathNode(closestNode,this.shortestPath);
		}
		else if (this.attempts<this.MAX_NODE_RETURN){
			nextNode = closestNode;
			this.attempts++;
		}
		else if (this.attempts>=this.MAX_NODE_RETURN){
			this.attempts = 0;
			return -1;
		}
	}


	next.latitude = mapLat(nextNode);
	next.longitude = mapLon(nextNode);
	next.name = nextNode;
	//sconsole.log("current gps:  "+this.gps.getGPSNode(lat, lon ).toString());
	/*if (this.currentDestination == undefined){
		return -1;
	}*/

	// and if you are already within reach of your destination which we should define as a variable amount we return 0 for success 
	// this means dont move anymore
	// CODE GOES here for the thing youre doing

	return next;
}

function getClosestNode(currentLat, currentLon){
	var minDist = 1/0;
	var minNodeName;
	for (var i = 0; i<_pathfinder.nodeName.length;i++){
		var newDist = _toolset.getGPSDistance(currentLat, currentLon, mapLat(_pathfinder.nodeName[i]),mapLon(_pathfinder.nodeName[i]));
		if (newDist < minDist){
			minDist = newDist;
			minNodeName = _pathfinder.nodeName[i];
		}
	}
	var closestNodePair = [minNodeName, minDist];
	return closestNodePair;
}

function isOnTrack(nodeName, path){
	var onTrack = false;
	for (var i = 0; i<path.length;i++){
		if (path[i]==nodeName){
			onTrack = true;
			break;
		}
	}
	return onTrack;
}


//////////////////////////////////////////////////////////////////////////////

function PriorityQueue () {
	this._nodes = [];
	this.enqueue = function (priority, key) {
		this._nodes.push({key: key, priority: priority });
		this.sort();
	}
	this.dequeue = function () {
		return this._nodes.shift().key;
	}
	this.sort = function () {
		this._nodes.sort(function (a, b) {
			return a.priority - b.priority;
		});
	}

	this.isEmpty = function () {
		return !this._nodes.length;
	}
}
/**
* Pathfinding starts here
*/
function Graph(){
	var INFINITY = 1/0;
	this.vertices = {};
	this.addVertex = function(name, edges){
		this.vertices[name] = edges;
	}
	this.shortestPath = function (start, finish) {
		this.cost = 0;
		var nodes = new PriorityQueue(),
		distances = {},
		previous = {},
		path = [],
		smallest, vertex, neighbor, alt;
		for(vertex in this.vertices) {
			if(vertex === start) {
				distances[vertex] = 0;
				nodes.enqueue(0, vertex);
			}else {
				distances[vertex] = INFINITY;
				nodes.enqueue(INFINITY, vertex);
			}
			previous[vertex] = null;
		}
		
		while(!nodes.isEmpty()) {
			cost = 0;
			smallest = nodes.dequeue();
			if(smallest === finish) {
				path;
				cost+=distances[smallest];
				while(previous[smallest]) {
					path.push(smallest);
					smallest = previous[smallest];
				}
				break;
			}
			if(!smallest || distances[smallest] === INFINITY){
				continue;
			}
			for(neighbor in this.vertices[smallest]) {
				alt = distances[smallest] + this.vertices[smallest][neighbor];
				if(alt < distances[neighbor]) {
					distances[neighbor] = alt;
					previous[neighbor] = smallest;
					nodes.enqueue(alt, neighbor);
				}
			}
		}
		return path;
	}
}

function getNextPathNode(currentNode,inputPath){
	for (var i =0;i<inputPath.length;i++){
		if (inputPath[i]==currentNode){
			break;
		}
	}
	return inputPath[i+1];
}


// Log test, with the addition of reversing the path and prepending the first node so it's more readable



_pathfinder.prototype.readFile = function (){
	var workbook = this.XLS.readFile('nodes2.xls');
	var sheet_name_list = workbook.SheetNames;
	_pathfinder.lat= new Array();
	_pathfinder.lon= new Array();
	_pathfinder.nodeName = new Array();
	_pathfinder.neighbors = new Array();
	_pathfinder.map={};
	_pathfinder.row = 1;
	_pathfinder.col = 'D';
	_pathfinder.edges= new Array();
	sheet_name_list.forEach(function(y) {
		var worksheet = workbook.Sheets[y];
		for (z in worksheet) {
			if(z[0] === '!') continue;
			if (z.substring(1)==_pathfinder.row){
				if ((z.substring(0,1)=='A')){
					_pathfinder.nodeName.push(worksheet[z].v);
				}
				else if ((z.substring(0,1)=='B')){
					_pathfinder.lon.push(worksheet[z].v);
				}
				else if ((z.substring(0,1)=='C')){
					_pathfinder.lat.push(worksheet[z].v);
				}
				else{
					if (z.substring(0,1)==_pathfinder.col && worksheet[z].v  != 'n'){
						_pathfinder.edges.push(worksheet[z].v);
						_pathfinder.col = String.fromCharCode(_pathfinder.col.charCodeAt() + 3);
					}
					else if (worksheet[z].v  == 'n'){
						_pathfinder.neighbors.push(_pathfinder.edges);
						_pathfinder.col = 'D';
						_pathfinder.row++;
						_pathfinder.edges = new Array();
					}
				}
			}
		}
	});
	for (var i = 0;i<_pathfinder.lon.length;i++){
		_pathfinder.map[_pathfinder.nodeName[i]] = [_pathfinder.lat[i],_pathfinder.lon[i],_pathfinder.neighbors[i]];
	}
	//console.log(_pathfinder.map);
}

function mapLat(name){
	return _pathfinder.map[name][0];
}

function mapLon(name){
	return _pathfinder.map[name][1];
}

_pathfinder.prototype.createGraph=function(){
	var graph = new Graph();
	for (var i = 0; i< _pathfinder.nodeName.length;i++){
		var tempLat = mapLat(_pathfinder.nodeName[i]);
		var tempLon = mapLon(_pathfinder.nodeName[i]);
		var tempNeighbor = _pathfinder.map[_pathfinder.nodeName[i]][2];
		var s = {};
		for (var j = 0;j<tempNeighbor.length;j++){
			//console.log(getDistance(tempLat, tempLon, mapLat(tempNeighbor[j]),mapLon(tempNeighbor[j])));
			s[tempNeighbor[j]] = _toolset.getGPSDistance(tempLat, tempLon, mapLat(tempNeighbor[j]),mapLon(tempNeighbor[j]));
		}
		graph.addVertex(_pathfinder.nodeName[i],s);
	}
	//console.log(graph);
	return graph;
}
