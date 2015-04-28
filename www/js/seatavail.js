var quotas;
var coachclass;
var dateselected;


function goBack() {
    window.location.replace('HomePage.html');
}
$("#seatAvailibility").on(click, function () {

    var startStation = sessionStorage.getItem("startStation");
    var endStation = sessionStorage.getItem("endStation");
    var trainSelected = sessionStorage.getItem("trainSelected");
    alert(startStation);
    document.getElementById("newfrom").innerHTML = startStation;
    document.getElementById("newto").innerHTML = endStation;
});

// Get todays date
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

    today = dd + '-' + mm + '-' + yyyy;
    $("#dateoftravel").val(today);
    return today;
}

/*function convertDate(dateSelect) {
    var returnedFormat = dateSelect.split("-");
    var dateIs = returnedFormat[2]; //Gets Date
    var yearIs = returnedFormat[0]; // Gets Year
    //For Getting Month
    var d = new Date(dateSelect);
    var stringDate = d.toString();
    var splitDate = stringDate.split(" ");
    var monthIs = splitDate[1].toUpperCase();

    var finalString = dateIs + "-" + monthIs + "-" + yearIs;
    return finalString;
}*/

function searchSeatAvailibility() {
    saveUserInput();
   var dateSelected = $("#dateoftravel").val();
    if (dateselected.length < 3) {
        alert("No Date Selected");
        return false;
    } else if (coachclass.length < 2) {
        alert("Please Select Class");
        return false;
    } else {
        startStation = sessionStorage.getItem("startStation");
        endStation = sessionStorage.getItem("endStation");
        trainSelected = sessionStorage.getItem("trainSelected");

        var seatDetails = "";
        var stcode1 = startStation;
        var a = stcode1.split("-");
        stcode1 = a[0];
        var stcode2 = endStation;
        var b = stcode2.split("-");
        stcode2 = b[0];
        var trainSelected = trainSelected;
        var apilink = 'http://api.erail.in/seats/?key=3d970b43-550b-4568-9227-492697f47093&trainno=' + trainSelected + "&stnfrom=" + stcode1 + "&stnto=" + stcode2 + "&quota=" + quotas + "&class=" + coachclass + "&date=" + dateselected;
        $.ajax({
            type: 'GET',
            url: apilink,
            dataType: 'json',
            success: function (data) {
                if (data.status == "OK") {
                    seatDetails += "<li><h1>Date</h1><strong><p class='ui-li-aside'>Seats</p></strong></li>";
                    for (var i = 0; i < data.result.seats.length; i++) {
                        seatDetails += "<li><h2>" + data.result.seats[i].date + "</h2>";
                        seatDetails += "<p class='ui-li-aside'>" + data.result.seats[i].seat + "</p>";
                        seatDetails += "</li>";
                    }
                } else {
                    seatDetails = data.status;
                }
                document.getElementById('seatResults').innerHTML = seatDetails;

            },
            error: function (x, e) {
                alert('ERROR');
            }

        });
        return true;
    }
}

function fetchFareDetails() {

    saveUserInput();
    if (dateselected.length < 3) {
        alert("No Date Selected");
        return false;
    } else if (coachclass.length < 2) {
        alert("Please Select Class");
        return false;
    } else {
    
   
    var dateSelected = $("#dateoftravel").val();

    var trainNo = sessionStorage.getItem("trainSelected");
    var startStation = getStnCode(sessionStorage.getItem("startStation"));
    var endStation = getStnCode(sessionStorage.getItem("endStation"));
    document.getElementById('dateoftravel').value = dateSelected;
    var newDate = convertDate(document.getElementById('dateoftravel').value);
    //  dateSelected = "05-MAY-2015";
    var link = "http://api.erail.in/fare/?key=3d970b43-550b-4568-9227-492697f47093&trainno=" + trainNo + "&stnfrom=" + startStation + "&stnto=" + endStation + "&age=AD" + "&quota=" + quotas + "&class=" + coachclass + "&date=" + dateSelected;

    $.ajax({
        type: 'GET',
        url: link,
        dataType: 'json',
        success: function (data) {
            if (data.status == "OK") {

                for (var i = 0; i < data.result.fare.length; i++) {
                    fare = data.result.fare[i].fare;
                }
                document.getElementById('getfare').innerHTML = fare;


            } else {

                document.getElementById('getfare').innerHTML = data.status;
            }
        },
        error: function (x, e) {
            alert('ERROR');
        }

    });
        return true;
    }
        
}

function saveUserInput() {
    quotas = document.getElementById('quotas').value;
    coachclass = document.getElementById('trainclass').value;
    dateselected = document.getElementById('dateoftravel').value;
}

function redirectToFares() {
        saveUserInput();
        sessionStorage.setItem("dateSelected", dateselected);
        sessionStorage.setItem("coachClass", coachclass);
        sessionStorage.setItem("quota", quotas);

        // window.location.replace("GetFares.html");
    } // JavaScript Document