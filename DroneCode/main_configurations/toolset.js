
var _toolset = {};

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function rad2deg(rad){
	return rad/(Math.PI/180)
}

_toolset.getGPSDistance = function ( lat1,lon1,lat2,lon2 ) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
 // console.log('dlat '+dLat);
  var dLon = deg2rad(lon2-lon1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c*1000; // Distance in km
  return d;
}


_toolset.getGPSBearing = function ( lat1,lon1,lat2,lon2 ){
	var bearing =Math.atan2(Math.sin(deg2rad(lon2-lon1))*Math.cos(deg2rad(lat2)), Math.cos(deg2rad(lat1))*Math.sin(deg2rad(lat2))-Math.sin(deg2rad(lat1))*Math.cos(deg2rad(lat2))*Math.cos(deg2rad(lon2-lon1)));
	return rad2deg(bearing);
}