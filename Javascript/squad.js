$(document).ready($(function () {
    console.info('squad.js Loaded!');
    var $chk = $('#check');
    var endD = $('#multiple');
    endD.hide();

    // Get json data.
    var data = JSON.parse(servers);
  
    $chk.change(function () {
      endD.toggle();
    })
  
    var $data = $('#data-adjust')
    document.getElementById('submitButton').addEventListener('click', function () {
      $data.empty();
      var load = "Loading...";
      var p = document.createElement('p');
      var newText = document.createTextNode(load);
      $data.append(newText);
      data();
    })
  }))
  
  var nullDateTime;
  var mom = moment().tz("Europe/London");
  
  function data() {
  
    var frm1 = document.getElementById('frm1');
    var formData = document.forms[0];
  
    var startTime = formData['sTime'].value;
    var endTime = formData['eTime'].value;
    var startDate = formData['sDate'].value;
    var endDate = formData['eDate'].value;
    var selectedServer = formData['server'].value;
    var newStartDate;
    var newEndDate;
  
    // if the start time was not provided
    if (startTime == "" || startTime == null) {
      // if the start Date was not provided
      if (startDate == "" || startDate == null) {
        // go 24 hours ago and set the newStartDate to this variable as it gets the whole timeframe
        newStartDate = moment().tz("Europe/London").utc().subtract(24, 'hours').format();
        console.log("StartDate1 = " + newStartDate);
      } else {
        // Start date was provided
        // Start at beginning of day provided
        newStartDate = moment(startDate).startOf('day').subtract(6, 'hours').format();
        console.log("StartDate2 = " + newStartDate);
      }
    } else if (startTime != "" || startTime != null) {
      // A time was provided
      // Check to see if a date was provided
      if (startDate == "" || startDate == null) {
        // no date provided, use time for today.
        var time = moment(`${startTime}`, "hh:mm").tz("Europe/London").utc().add(24, 'hours').subtract(5, 'hours').format();
        newStartDate = time
        console.log("StartDate3 = " + newStartDate);
      } else {
        // date provided, format with date and time
        newStartDate = moment(`${startDate} ${startTime}`, 'YYYY-MM-DD hh:mm').tz("Europe/London").utc().subtract(5, 'hours').format();
        console.log("StartDate4 = " + newStartDate);
      }
    }
  
    // if the end time was not provided
    if (endTime == "" || endTime == null) {
      // if the end Date was not provided
      if (endDate == "" || endDate == null) {
        // get now
        newEndDate = moment().tz("Europe/London").utc().format();
        console.log("EndDate1 = " + newEndDate);
      } else {
        // end date was provided
        // end at end of day provided
        newEndDate = moment(endDate).endOf('day').format();
        console.log("EndDate2 = " + newEndDate);
      }
    } else if (endTime != "" || endTime != null) {
      // A time was provided
      // Check to see if a date was provided
      if (endDate == "" || endDate == null) {
        // no date provided, use provided time for today
        newEndDate = moment(endTime, "hh:mm").tz("Europe/London").utc().add(24, 'hours').subtract(5, 'hours').format();
        console.log("EndDate3 = " + newEndDate);
      } else {
        // date provided, format with date and time
        console.log(endDate + endTime);
        newEndDate = moment(`${endDate} ${endTime}`, 'YYYY-MM-DD hh:mm').tz("Europe/London").utc().subtract(5, 'hours').format();
        console.log("EndDate4 = " + newEndDate);
      }
    }

    if(selectedServer != 'none') {
      sendRequest(newStartDate, newEndDate, selectedServer);
    }
    else {
      alert("Pleases select a server to get data from!");
    }
  
  }
  
  function sendRequest(startDate, endDate, server) {
  
    var sDate = startDate.toString();
    var eDate = endDate.toString();
    var spot = $('#data-adjust');
    $.ajax({
      type: 'GET',
      url: `https://api.battlemetrics.com/servers/${server}/relationships/sessions?include=player&start=${sDate}&stop=${eDate}`,
      // For you nerds who are looking here and think you're slick, this API key is viewonly for server info which is already public information. ~ Vex
      // Its only here temporarily so it can be used in the short term. Long term this will probably be done with expressjs
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjE5N2NhNTQyN2JkOTVjZTkiLCJpYXQiOjE2MTU1NzIxMTEsIm5iZiI6MTYxNTU3MjExMSwiaXNzIjoiaHR0cHM6Ly93d3cuYmF0dGxlbWV0cmljcy5jb20iLCJzdWIiOiJ1cm46dXNlcjoxMjM3MDEifQ.GWUl23xH1Tt-DILLbWzk0lsdIv3WrdLcFCcCpd-UWHU`
      },
      contentType: "application/json; charset-utf-8",
      dataType: "json",
      timeout: 5000,
      success: function (data) {
        spot.empty();
        var serverText = '';
        switch(true) {
          case '8544214':
            // Tac1
            serverText = 'Tactical Realism 1'
            break;
          case '8595794':
            // event
            serverText = 'Event Server'
          case '9094414':
            // training
            serverText = 'Training Server'
            break;
          case 'none':
            // Don't do anything. They have not selected a server
            break;
          default:
            // Don't do anything. They have not selected a server
            break;
        }
        var ul = document.createElement('ul');
        data.included.forEach(user => {
          if (user.attributes.name != null) {
            if (user.attributes.name.toLowerCase().startsWith('=7cav=')) {
              //$data.text() += user.attributes.name + "<br>";
              var li = document.createElement('li');
              var pText = user.attributes.name;
              var newText = document.createTextNode(pText);
              li.appendChild(newText);
              ul.appendChild(li);
              var att = document.createAttribute("class");
              att.value = "cavList";
              ul.setAttributeNode(att);
            }
          }
        });
        console.log(ul.childNodes)
        if(ul.childNodes.length > 0) {
          spot.append(ul);
        } else {
          console.log("The UL was empty")
          var p = document.createElement('p');
          var text = "No Cav members Found during this time.";
          var newText = document.createTextNode(text);
          p.appendChild(newText);
          spot.append(p);
        }
      }
    })
  }