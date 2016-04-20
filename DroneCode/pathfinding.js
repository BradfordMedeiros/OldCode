//Autonomous Tour Guide Application for AR Parrot Drone. 
// @ Yingyan Samantha Wang
// @ April 10th, 2015
//
// The self path finding functionality is implemented as below. 
//There are two main parts":
//1. Algorithm to determine the shortest path, given destination, current GPS location, and the entire campus map represented as nodes and edges. 
//This part of the program involves reading files to create a graph to represent the map, and the classic Dijkstra's algorithm. 
//2. Algorithm to determine the next node the drone should proceed to.
//This part of the program considers different scenarios that could occur during the flight. 
//There are 6 basic situations:
//1. The drone is on track, and can proceed to the next node along the path. 
//2. The drone is still considered on track, but too far from the closest node that exists on the map, the drone should fly back to the closest node on the path, 
//   to stay close to the path. 
//3. The drone is completely off the track, A new path needs to be computed, and then 1 and 2 would be repeated. 
//4. A attempt counter is kept, so that after certain amount of arbitrary attempt, no more attempts should be performed. 
//5. Destination is reached, and task is successful. 
//6. Special cases: the drone's GPS is completely off the map/no GPS data is read. 

//Constructor; Initialization. 
function _pathfinder(gps, xls) {
    this.name = "pathfinder";
    this.gps = gps;
    this.currentDestination = undefined;
    this.currentOrigin = undefined;
    this.MAX_RADIUS_OFFSET = 20; // Arbitrary max number of meters before going back to closest node
    this.MAX_NODE_RETURN = 5; // Arbitrary max number of times we will go back to node (not the distance)
    this.KILL_IF_EXCEED_RETURN = true;
    this.XLS = xls;
    this.readFile();
    this.campusMap = this.createGraph();
    this.attempts = 0;
    this.globalAttempts = 0;
}


// Offer a list of possible destinations we could go to.
_pathfinder.prototype.getDestinationList = function() {
    return _pathfinder.nodeName;
}

// Get the destination of the path. 
_pathfinder.prototype.getDest = function() {
    var last = this.shortestPath.length - 1;
    return this.shortestPath[last];
}

//1. Set the destination;
//2. Based on the current gps location and the campus map, get the closest current node in the map file. 
//3. Compute the shortest path. 
_pathfinder.prototype.setDestination = function(destination_name, currentgps) {
    var currentLon;
    var currentLat;
    if (currentgps != undefined) {
        currentLon = this.gps.getLongitude(currentgps.longitude);
        currentLat = this.gps.getLatitude(currentgps.latitude);
    } else {
        currentLon = this.gps.getLongitude();
        currentLat = this.gps.getLatitude();
    }
    if (currentLon == undefined || currentLat == undefined) {
        console.log("ERROR: NO GPS DATA");
        return -3;
    }
    var current_name = getClosestNode(currentLat, currentLon);
    console.log("current name is :  " + current_name);
    this.currentDestination = destination_name;
    this.shortestPath = this.campusMap.shortestPath(current_name, this.currentDestination).concat([current_name]).reverse();
    this.attempts = 0;
    console.log("EVENT:  Destination set:  " + destination_name);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                                                                                */
/* The getNextNode function is the most crucial function in this piece of code.                                   */
/* From the higher level controller side of the view, this is the API function to call to determine               */
/* the movement of the drone.                                                                                     */
/* The drone is only aware of it's current location, and the path it is supposed to follow.                       */
/* Based on the difference of the drone location and the precomputed path, the drone determines the next          */
/* node to proceed to. The drone also send a special status code of "-1", when certain amount of attempts         */
/* have been executed.                                                                                            */
/* The controller is responsible for the drone's movement, only based on the information of the node the drone    */
/* is proceeding to. It the special code "-1" is sent, the task is determined as impossible to perform due to     */
/* unexpected circumstances, and external user action should be taken, or a landing will be performed.            */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Step 1:  Get Current GPS latitude and longitude
// Step 2:  Identify closest node to the current location
// Step 3:  If the drone is on track, and current node is close to the map node, go to next node 
//          else, fly back to the closest node. 
//          Fly back a total of X times. X is arbitrary, up to testing. 
//			After X unsuccessful attempts, send status code -1 for the controller to decide on the actions to take
//          When the drone is at current node go to next node according to precomputed shortest path. 
//          If the drone is off the track, and if the drone is on another node that exist on the map,
//          Computer new shortest path, and repeat the same algorithm as above.
// Step5:   return GPS coordinates of next node 

_pathfinder.prototype.getNextNode = function(lat, lon) {
    console.log(this.currentDestination);
    if (this.currentDestination == undefined) {
        console.log("ERROR:  destination not defined");
        return -1;
    } else {
        console.log("destination defined");
    }
    var currentLat = this.gps.getLatitude(lat);
    var currentLon = this.gps.getLongitude(lon);
    var next = {};
    var closestNode = getClosestNode(currentLat, currentLon)[0];
    var closestDist = getClosestNode(currentLat, currentLon)[1];
    console.log("closest Node: " + closestNode);
    console.log("closest Dist: " + closestDist);
    if (isOnTrack(closestNode, this.shortestPath)) { // if closestNode is along the computed shortest path
        //Within maximum attempt, the closest node to current location is the destination node, then destination is reached.
        //Control code will receive the "0" signal, and allow the drone to perform landing.
        if (closestDist < this.MAX_RADIUS_OFFSET && closestNode == this.currentDestination) {
            console.log("Dest Reached!");
            return 0;
        }
        //If the node closest to current GPS location is within the allowed error range.,
        //The drone is on track, and able to proceed to the next node. 
        if (closestDist < this.MAX_RADIUS_OFFSET) {
            nextNode = getNextPathNode(closestNode, this.shortestPath);
            this.attempts = 0;
        }
        //If the distance between the closest node and the current location is larger than the error range
        //The drone needs to fly to the closest node on the path to get back on track.
        //The attempt count will increase.
        else if (this.attempts < this.MAX_NODE_RETURN) {
            nextNode = closestNode;
            this.attempts++;
            console.log("attempt: " + this.attempts);
        }
        //If the drone has attempted the maximum attempts allowed, and the distance between the drone's location and 
        //the node on the map is still outside of the error range, current task fails, and return the status code "-1"
        else if (this.attempts >= this.MAX_NODE_RETURN) {
            return -1;
        }
    } else { // not on the track any more
        //Computer the new path to get to the destination from the current location
        this.shortestPath = this.campusMap.shortestPath(closestNode, this.currentDestination).concat([closestNode]).reverse();
        console.log("New Track: shortest path: " + this.shortestPath);
        this.globalAttempts++;
        //If the drone exceeds the overall attempt to reach the destination, return status code "-1"
        if (this.globalAttempts > this.MAX_NODE_RETURN) {
            return -1;
        }
        //If closestNode exist on the map and the distance is within the threshold
        //The drone can proceed to fly to the next node along the newly computed path.
        else if (closestDist < this.MAX_RADIUS_OFFSET) {
            nextNode = getNextPathNode(closestNode, this.shortestPath);
        }
        //If the distance is larger than the threshold, the drone attempts to fly back to the closest node on the path.
        else if (this.attempts < this.MAX_NODE_RETURN) {
            nextNode = closestNode;
            this.attempts++;
        }
        //If the attempts exceed the maximum number, the current task is unsuccessful, and return status code "-1"
        else if (this.attempts >= this.MAX_NODE_RETURN) {
            this.attempts = 0;
            return -1;
        }
    }

    next.latitude = mapLat(nextNode);
    next.longitude = mapLon(nextNode);
    next.name = nextNode;
    return next;
}

// Return the closest node existing map, based on the current location.
function getClosestNode(currentLat, currentLon) {
    var minDist = 1 / 0;
    var minNodeName;
    for (var i = 0; i < _pathfinder.nodeName.length; i++) {
        var newDist = _toolset.getGPSDistance(currentLat, currentLon, mapLat(_pathfinder.nodeName[i]), mapLon(_pathfinder.nodeName[i]));
        if (newDist < minDist) {
            minDist = newDist;
            minNodeName = _pathfinder.nodeName[i];
        }
    }
    var closestNodePair = [minNodeName, minDist];
    return closestNodePair;
}

// Determine whether the drone is still on track. 
// It is possible that the drone become closer to another node existing on the map, that is not along the precomputed path. 
function isOnTrack(nodeName, path) {
    var onTrack = false;
    for (var i = 0; i < path.length; i++) {
        if (path[i] == nodeName) {
            onTrack = true;
            break;
        }
    }
    return onTrack;
}


//////////////////////////////////////////////////////////////////////////////
/* Path finding algorithm;                                                   */
/* Read in Excel map file, and construct graph;                              */
/* Compute shortest distance using Dijkstra algorithm.                       */
/* Return next node to fly to along the shortest path based on current node. */
//////////////////////////////////////////////////////////////////////////////

// Helper function with the heap data structure to optimize the Dijkstra algorithm. 
function PriorityQueue() {
    this._nodes = [];
    this.enqueue = function(priority, key) {
        this._nodes.push({
            key: key,
            priority: priority
        });
        this.sort();
    }
    this.dequeue = function() {
        return this._nodes.shift().key;
    }
    this.sort = function() {
        this._nodes.sort(function(a, b) {
            return a.priority - b.priority;
        });
    }

    this.isEmpty = function() {
        return !this._nodes.length;
    }
}

// Return the shortest path from origin to destination using Dijktra's algorithm. 
function Graph() {
    var INFINITY = 1 / 0;
    this.vertices = {};
    this.addVertex = function(name, edges) {
        this.vertices[name] = edges;
    }
    this.shortestPath = function(start, finish) {
        this.cost = 0;
        var nodes = new PriorityQueue(),
            distances = {},
            previous = {},
            path = [],
            smallest, vertex, neighbor, alt;
        for (vertex in this.vertices) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(0, vertex);
            } else {
                distances[vertex] = INFINITY;
                nodes.enqueue(INFINITY, vertex);
            }
            previous[vertex] = null;
        }

        while (!nodes.isEmpty()) {
            cost = 0;
            smallest = nodes.dequeue();
            if (smallest === finish) {
                path;
                cost += distances[smallest];
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }
            if (!smallest || distances[smallest] === INFINITY) {
                continue;
            }
            for (neighbor in this.vertices[smallest]) {
                alt = distances[smallest] + this.vertices[smallest][neighbor];
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = smallest;
                    nodes.enqueue(alt, neighbor);
                }
            }
        }
        return path;
    }
}

//Return the next node along the shortest path. 
function getNextPathNode(currentNode, inputPath) {
    for (var i = 0; i < inputPath.length; i++) {
        if (inputPath[i] == currentNode) {
            break;
        }
    }
    return inputPath[i + 1];
}

//Read information about each node from the map file.  
_pathfinder.prototype.readFile = function() {
    var workbook = this.XLS.readFile('nodes2.xls'); //Name of the map file in the same directory.
    var sheet_name_list = workbook.SheetNames;
    _pathfinder.lat = new Array();
    _pathfinder.lon = new Array();
    _pathfinder.nodeName = new Array();
    _pathfinder.neighbors = new Array();
    _pathfinder.map = {};
    _pathfinder.row = 1;
    _pathfinder.col = 'D';
    _pathfinder.edges = new Array();
    sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        for (z in worksheet) {
            if (z[0] === '!') continue;
            if (z.substring(1) == _pathfinder.row) {
                if ((z.substring(0, 1) == 'A')) {
                    _pathfinder.nodeName.push(worksheet[z].v);
                } else if ((z.substring(0, 1) == 'B')) {
                    _pathfinder.lon.push(worksheet[z].v);
                } else if ((z.substring(0, 1) == 'C')) {
                    _pathfinder.lat.push(worksheet[z].v);
                } else {
                    if (z.substring(0, 1) == _pathfinder.col && worksheet[z].v != 'n') {
                        _pathfinder.edges.push(worksheet[z].v);
                        _pathfinder.col = String.fromCharCode(_pathfinder.col.charCodeAt() + 3);
                    } else if (worksheet[z].v == 'n') {
                        _pathfinder.neighbors.push(_pathfinder.edges);
                        _pathfinder.col = 'D';
                        _pathfinder.row++;
                        _pathfinder.edges = new Array();
                    }
                }
            }
        }
    });
    for (var i = 0; i < _pathfinder.lon.length; i++) {
        _pathfinder.map[_pathfinder.nodeName[i]] = [_pathfinder.lat[i], _pathfinder.lon[i], _pathfinder.neighbors[i]];
    }
}

// Get the latitude of the location
function mapLat(name) {
    return _pathfinder.map[name][0];
}

// Get the longitude value of the location
function mapLon(name) {
    return _pathfinder.map[name][1];
}

// Construct a the graph for map
_pathfinder.prototype.createGraph = function() {
    var graph = new Graph();
    for (var i = 0; i < _pathfinder.nodeName.length; i++) {
        var tempLat = mapLat(_pathfinder.nodeName[i]);
        var tempLon = mapLon(_pathfinder.nodeName[i]);
        var tempNeighbor = _pathfinder.map[_pathfinder.nodeName[i]][2];
        var s = {};
        for (var j = 0; j < tempNeighbor.length; j++) {
            s[tempNeighbor[j]] = _toolset.getGPSDistance(tempLat, tempLon, mapLat(tempNeighbor[j]), mapLon(tempNeighbor[j]));
        }
        graph.addVertex(_pathfinder.nodeName[i], s);
    }
    return graph;
}