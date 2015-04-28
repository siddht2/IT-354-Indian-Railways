        var stcode1 = "";
        var stcode2 = "";
        var trainNo = [];

        var selelctedValue = null;

        function onSelectValueInDropdown() {

            //Value selected from dropdown
            selelctedValue = $('#select-train-dd :selected').val();
            return selelctedValue;
        }

        //Get current date-http://stackoverflow.com/questions/1531093/how-to-get-current-date-in-javascript

        function getTodayDate() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            today = mm + '/' + dd + '/' + yyyy;
            return today;
        }

        // main page function
        $( document ).on( "pageinit", "#pagemenu", function(){

            if (typeof (Storage) != "undefined") {
                stcode1 = localStorage.getItem("station1");
                stcode2 = localStorage.getItem("station2");
                document.getElementById('station1').innerHTML = stcode1;
                document.getElementById('station2').innerHTML = stcode2;
            }
            var apiLink = 'http://api.erail.in/trains/?key=3d970b43-550b-4568-9227-492697f47093&stnfrom=';
            var linkModified = apiLink + stcode1 + "&stnto=" + stcode2;
            var trainDropDown = "<option value='1' disabled='disabled' selected='selected'>Select a Train...</option>";
            $.ajax({
                type: 'GET',
                url: linkModified,
                dataType: 'json',
                success: function (data) {

                    for (var i = 0; i < data.result.length; i++) {

                        trainNo[i] = data.result[i].trainno;

                        //Code for Drop Down list
                        trainDropDown += "<option value='" + data.result[i].trainno + "'>" + data.result[i].name + "-" + data.result[i].trainno + "</option>";
                    }

                    if (data.result.length < 1) {
                        trainsListToDisplay = "No trains running on this route";
                    }

                    document.getElementById('select-train-dd').innerHTML = trainDropDown;

                },
                error: function (x, e) {
                    alert('ERROR');
                }
            });

        });

        //Route function

        function getStops() {

            var trainno = onSelectValueInDropdown();

            var apilink = 'http://api.erail.in/route/?key=3d970b43-550b-4568-9227-492697f47093&trainno=';
            apilink += trainno;
            var displayTable = "<table border='1'>"
            displayTable += "<tr><th>Stop Name</th><th>Arrival Time</th><th>Departure Time</th></tr>";


            $.ajax({
                type: 'GET',
                url: apilink,
                dataType: 'json',
                success: function (data) {

                    document.getElementById('trainname').innerHTML = data.result.name;
                    document.getElementById('trainno').innerHTML = data.result.trainno;

                    for (var i = 0; i < data.result.route[0].stn.length; i++) {
                        displayTable += "<tr>";
                        displayTable += "<td>" + data.result.route[0].stn[i].name + "</td>";
                        displayTable += "<td>" + data.result.route[0].stn[i].arr + "</td>";
                        displayTable += "<td>" + data.result.route[0].stn[i].dep + "</td>";
                        displayTable += "</tr>";
                    }
                    displayTable += "</table>";
                    document.getElementById('displaystoplist').innerHTML = displayTable;
                },
                error: function (x, e) {
                    alert('ERROR');
                }
            });
        }

        //LiveStatus function

        function getLiveStatus() {

            var trainno = onSelectValueInDropdown();

            var apilink = 'http://api.erail.in/live/?key=3d970b43-550b-4568-9227-492697f47093&trainno=';
            apilink += trainno;
            apilink += "&stnfrom=" + stcode1;
            apilink += "&date=" + getTodayDate();
            console.log(apilink);
            $.ajax({
                type: 'GET',
                url: apilink,
                dataType: 'json',
                success: function (data) {
                    if (data.status == "OK") {
                        alert(data.result.name + "-" + data.result.trainno);
                        document.getElementById('trainnm').innerHTML = data.result.name;
                        document.getElementById('trainid').innerHTML = data.result.trainno;
                        document.getElementById('delayrun').innerHTML = data.result.delayrun;
                        document.getElementById('statusat').innerHTML = data.result.statusat;
                        document.getElementById('statusmsg').innerHTML = data.result.statusmsg;
                        document.getElementById('platform').innerHTML = data.result.platform;
                    } else {
                        document.getElementById('status').innerHTML = data.status;
                    }

                },
                error: function (x, e) {
                    alert('ERROR');
                }
            });
        }

        //Map functions start

        var map; // Google map object

        // Initialize and display a google map
        $(function mapFunctionStart() {
            // Create a Google coordinate object for where to initially center the map
            var latlng = new google.maps.LatLng(21.0000, 78.0000); // Washington, DC

            // Map options for how to display the Google map
            var mapOptions = {
                zoom: 6,
                center: latlng
            };

            // Show the Google map in the div with the attribute id 'map-canvas'.
            map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			
            
			// Update the Google map for the user's inputted address
            $("#toMap").click(function (event) {
                var geocoder = new google.maps.Geocoder(); // instantiate a geocoder object
				
                // Get the user's inputted address

                var address = localStorage.getItem("startStation");
                alert(address);
                // Make asynchronous call to Google geocoding API
                geocoder.geocode({
                    'address': address
                }, function (results, status) {
                    var addr_type = results[0].types[0]; // type of address inputted that was geocoded
                    if (status == google.maps.GeocoderStatus.OK)
                        ShowLocation(results[0].geometry.location, address, addr_type);
                    else
                        alert("Geocode was not successful for the following reason: " + status);
                });
            });
        });

        // Show the location (address) on the map.
        function ShowLocation(latlng, address, addr_type) {
            // Center the map at the specified location
            map.setCenter(latlng.getCenter());

            // Set the zoom level according to the address level of detail the user specified
            var zoom = 12;
            switch (addr_type) {
            case "administrative_area_level_1":
                zoom = 6;
                break; // user specified a state
            case "locality":
                zoom = 1;
                break; // user specified a city/town
            case "street_address":
                zoom = 15;
                break; // user specified a street address
            }
            map.setZoom(zoom);

            // Place a Google Marker at the same location as the map center 
            // When you hover over the marker, it will display the title
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: address
            });

            // Create an InfoWindow for the marker
            var contentString = "<b>" + address + "</b>"; // HTML text to display in the InfoWindow
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            // Set event to display the InfoWindow anchored to the marker when the marker is clicked.
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
        }

        //Map functions end