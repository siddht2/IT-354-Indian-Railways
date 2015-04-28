var quotas;
var coachclass;
var dateselected;
var startStation = "";
var endStation = "";
var trainSelected = "";

function goBack() {
    window.location.replace('HomePage.html');
}
$(document).ready(function (e) {

    startStation = sessionStorage.getItem("startStation");
    endStation = sessionStorage.getItem("endStation");
    trainSelected = sessionStorage.getItem("trainSelected");

    document.getElementById("from").innerHTML = startStation;
    document.getElementById("to").innerHTML = endStation;
});

// Get todays date
//Get current date-http://stackoverflow.com/questions/1531093/how-to-get-current-date-in-javascript
/*function getTodayDate() {
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

            today = dd + '/' + mm + '/' + yyyy;
			$("#dateoftravel").val(today);
            return today;
        }*/

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
    startStation = sessionStorage.getItem("startStation");
    endStation = sessionStorage.getItem("endStation");
    trainSelected = sessionStorage.getItem("trainSelected");

    var seatDetails = "";
    var stcode1 = startStation;
    var a = stcode1.split("-");
    stcode1 = a[0];
    //stcode1 = "NDLS"
    var stcode2 = endStation;
    var b = stcode2.split("-");
    stcode2 = b[0];
    //stcode2 = "CSTM"
    var trainSelected = trainSelected;

    saveUserInput();
    newDate = $("#dateoftravel").val();
    //alert($("#dateoftravel").val());
    //var newDate = "05-MAY-2015";
    var apilink = 'http://api.erail.in/seats/?key=3d970b43-550b-4568-9227-492697f47093&trainno=' + trainSelected + "&stnfrom=" + stcode1 + "&stnto=" + stcode2 + "&quota=" + quotas + "&class=" + coachclass + "&date=" + newDate;
    $.ajax({
        type: 'GET',
        url: apilink,
        dataType: 'json',
        success: function (data) {
            if (data.status == "OK") {
                seatDetails += "<table border='1'><tr><th>Date</th><th>Seats</th></tr>";
                for (var i = 0; i < data.result.seats.length; i++) {
                    seatDetails += "<tr><td>" + data.result.seats[i].date + "</td>";
                    seatDetails += "<td>" + data.result.seats[i].seat + "</td>";
                    seatDetails += "</tr>";
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