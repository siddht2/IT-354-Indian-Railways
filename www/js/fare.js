var fare = "";

function goBack() {
    window.location.replace('SelectStations.html');
}


function convertDate(dateSelect) {
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
}


function onPageLoad() {
    FetchAllData();
}

function getStnCode(stcode) {
    var a = stcode.split("-");
    return a[0];
}



function FetchAllData() {

    var fareDetails;
    //http://api.erail.in/fare/?key=3d970b43-550b-4568-9227-492697f47093&trainno=12138&stnfrom=NDLS&stnto=CSTM&age=AD&quota=GN&date=05-MAY-2015
    var quotaSelected = sessionStorage.getItem("quota");
    // quotaSelected = "GN";
    var coachSelected = sessionStorage.getItem("coachClass");;
    var dateSelected = sessionStorage.getItem("dateSelected");
    if (dateSelected == null) {
        var today = new Date();
        var dd = today.getDate() + 1;
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        today = dd + '/' + mm + '/' + yyyy;
        dateSelected = today
    }

    var trainNo = sessionStorage.getItem("trainSelected");
    var startStation = getStnCode(sessionStorage.getItem("startStation"));
    var endStation = getStnCode(sessionStorage.getItem("endStation"));
    document.getElementById('dateoftravel').value = dateSelected;
    var newDate = convertDate(document.getElementById('dateoftravel').value);
    //  dateSelected = "05-MAY-2015";
    var link = "http://api.erail.in/fare/?key=3d970b43-550b-4568-9227-492697f47093&trainno=" + trainNo + "&stnfrom=" + startStation + "&stnto=" + endStation + "&age=AD" + "&quota=" + quotaSelected + "&class=" + coachSelected + "&date=" + newDate;

    $.ajax({
        type: 'GET',
        url: link,
        dataType: 'json',
        success: function (data) {
            if (data.status == "OK") {
                fareDetails += "<table border='1'><tr><th>Date</th><th>Class</th><th>fare</th></tr>";
                for (var i = 0; i < data.result.fare.length; i++) {
                    fareDetails += "<tr><td>" + data.result.date + "</td>";
                    fareDetails += "<td>" + data.result.fare[i].cls + "</td>";
                    fareDetails += "<td>" + data.result.fare[i].fare + "</td>";
                    fareDetails += "</tr>";
                    fare = data.result.fare[i].fare;
                }
                document.getElementById('onlyFare').innerHTML = fare;
                fareDetails += "</table>";
                document.getElementById('fareDetails').innerHTML = fareDetails;
            } else {
                document.getElementById('onlyFare').innerHTML = data.status;
            }
        },
        error: function (x, e) {
            alert('ERROR');
        }

    });
}

function goBack() {
    window.location.reload("SeatAvailibility.html");

}

function directToPayment() {
    sessionStorage.setItem("tourfare", fare);
    window.location.replace("ProceedToPayment.html");
}