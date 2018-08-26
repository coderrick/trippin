var speed = 50;
function init() {
	hyper = {
		'start': TempleUniversity,
		'end': somewhere
	};
	///////////////////////////////////////////////////////////hyperlapse//////////////////////////////////////////
	hyperlapse = new Hyperlapse(document.getElementById('pano'), { //removed var b/c it restricted hyperlapse to this function
		lookat: hyper.end,//new google.maps.LatLng(37.81409525128964,-122.4775045005249),
		width: 1280,
		height: 800,
		zoom: 1,
		fov: 100,
		offset: { x: 20, y: 50, z: 90 },
		use_lookat: true,
		use_rotation_comp: true,
		rotation_comp: 180,
		distance_between_points: 1,
		millis: speed,
		use_elevation: true,
		elevation: 0
	});

	hyperlapse.onError = function (e) { //theses functions are automatically called in Hyperlapse.js
		console.log(e);
	};
	hyperlapse.onRouteComplete = function (e) {
		hyperlapse.load();
	};
	hyperlapse.onLoadComplete = function (e) {
		//hyperlapse.play();	
		hyperlapse.next();
	};
	$("#play").click(function (e) {
		hyperlapse.play();
	});
	$("#stop").click(function (e) {
		hyperlapse.pause();
	});
	$("#next").click(function (e) {
		hyperlapse.next();
		//hyperlapse.setFOV(10);
		hPoints = hyperlapse.getPoints();
		hCanvas = hPoints[3].image;


		var ctx = hCanvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(100, 75, 50, 0, 2 * Math.PI);
		ctx.stroke();

	});
	$("#prev").click(function (e) {
		hyperlapse.prev();
	});
	$("#toggle").click(function (e) {
		$("#map").toggle();
	});
	// ----------------------------Google Maps API stuff here...        		
	$("#load").click(function (e) {
		var directions_service = new google.maps.DirectionsService();
		var route = {
			request: {
				origin: hyper.start,//new google.maps.LatLng(39.982094, -75.15467899999999),
				destination: hyper.end,//new google.maps.LatLng(39.95106942853014, -75.16387897692107),
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			}
		};
		request = {
			origin: hyper.start,//start_point, 
			destination: hyper.end,//end_point, 
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		};
		directions_service.route(request, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				hyperlapse.generate({ route: response });
			} else {
				console.log(status);
			}
		})
	});
	//----------------End of Generate
}
window.onload = init;

var rendererOptions = {
	draggable: true
};

var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();
var map;
var TempleUniversity = new google.maps.LatLng(39.98320375131727, -75.15682697296143);
var somewhere = new google.maps.LatLng(39.98017843488709, -75.15751361846924);
//console.log("temple " + TempleUniversity.getPosition());
function initialize() {

	var mapOptions = {
		zoom: 15,
		center: TempleUniversity
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById('directionsPanel'));

	google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {
		//console.log(arguments);
		//The problem is that generate() isn't changing when this even listener is triggered
		//TempleUniversity = marker.setPosition()
		console.log("it is ---" + directions_changed());
		computeTotalDistance(directionsDisplay.getDirections());
		console.log("new start coord = " + TempleUniversity.A + " : " + TempleUniversity.k);
		console.log("new end coord = " + somewhere.A + " : " + somewhere.k);
		console.log("total distance" + computeTotalDistance(directionsDisplay.getDirections()));
		hyper.start = new google.maps.LatLng(TempleUniversity.k, TempleUniversity.B);//(39.98320375131727, -75.15682697296143);
		hyper.end = new google.maps.LatLng(somewhere.k, somewhere.B);//(39.98017843488709, -75.15751361846924);
		console.log("new start coord ***= " + hyper.start);
		console.log("new end coord ***= " + hyper.end);
	});
	calcRoute();
}
//This function calculates the route between 2 map markers
function calcRoute() {

	var request = {
		origin: TempleUniversity,
		destination: somewhere,
		//waypoints:new google.maps.LatLng(39.99832832411263, -75.15360832214355),
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function (response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
	});

	//console.log("The: " + somewhere.position.lat());
}

function computeTotalDistance(result) {
	var total = 0;
	var myroute = result.routes[0];
	for (var i = 0; i < myroute.legs.length; i++) {
		total += myroute.legs[i].distance.value;
	}
	total = total / 1000.0;
	//document.getElementById('total').innerHTML = total + ' km';
}

google.maps.event.addDomListener(window, 'load', initialize);
