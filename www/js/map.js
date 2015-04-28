var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function loadMap() {
    initialize();
    calcRoute();
}

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(28.6139, 77.2090);
    var mapOptions = {
        zoom: 5,
        center: chicago
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
}

function splitCode(stcode) {
    var a = stcode.split("-");
    return a[1];
}

function calcRoute() {
    var sourceAddress = splitCode(sessionStorage.getItem("startStation"));
    var destination = splitCode(sessionStorage.getItem("endStation"));

    var request = {
        origin: sourceAddress,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

function goBack() {
    window.location.replace('HomePage.html');
}