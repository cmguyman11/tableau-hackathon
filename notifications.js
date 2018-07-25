'use strict';

(function() {
  $(document).ready(function() {
    tableau.extensions.initializeAsync().then(function() {
      showCurrentlySelectedWorksheets();
      var emails = ["derekhdawson@yahoo.com"]; // add your email here
      var emailBody = "<h1 style='color:#f4b342;'>your datasource was updated</h1>"; // add HTML for email body here
      sendEmail(emails, emailBody);
    })
  })
})();

var selectedWorksheets = [];
/**
* Shows the choose sheet UI. Once a sheet is selected, the data table for the sheet is shown
*/
function showSheetsDialog() {
  // Clear out the existing list of sheets
  $('#choose_sheet_buttons').empty();

  // Set the dashboard's name in the title
  const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
  $('#choose_sheet_title').text(dashboardName);

  // The first step in choosing a sheet will be asking Tableau what sheets are available
  const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;

  // Next, we loop through all of these worksheets add add buttons for each one
  worksheets.forEach(function (worksheet) {
    // Declare our new button which contains the sheet name
    const button = $("<input type='checkbox' class='btn btn-default btn-block'>" + worksheet.name +"</input>");
    if (isInArray(worksheet, selectedWorksheets)) {
      button.prop("checked", true);
    }
    // Create an event handler for when this button is clicked
    button.click(function () {
      // Get the worksheet name which was selected
      const worksheetName = worksheet.name;

      // Close the dialog and show the data table for this worksheet
      $('#choose_notification_dialog').modal('toggle');
      if (isInArray(worksheet, selectedWorksheets)) {
        var index =selectedWorksheets.indexOf(worksheet);
        selectedWorksheets.splice(index, 1);
      } else {
        selectedWorksheets.push(worksheet);
      }
    });

    // Add our button to the list of worksheets to choose from
    $('#choose_sheet_buttons').append(button);
  });

  // Show the dialog
  $('#choose_sheet_dialog').modal('toggle');
}

function closeDialog() {
  $('#choose_sheet_dialog').modal('toggle');
  refresh();
}

function refresh() {
  showCurrentlySelectedWorksheets();
}

function showCurrentlySelectedWorksheets() {
  $('#currently_selected_sheets').empty();
  selectedWorksheets.forEach(function(worksheet) {
    const div = $("<div class='selected_worksheet sheet_name'>" + worksheet.name +"</div>");
    $('#currently_selected_sheets').append(div);
  });
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function sendEmail(emails, emailBody) {
  for (var i = 0; i < emails.length; i++) {
    emails[i] = "\"" + emails[i] + "\"";
  }
  var sendTo = "[" + emails.join(",") + "]";
  var data = "{\n\t\"sendTo\": $sendTo$,\n\t\"sendFrom\": \"ddawson@tableau.com\",\n\t\"body\": \"$body$\",\n\t\"subject\": \"subject\",\n\t\"replyTo\": \"derekhdawson@yahoo.com\"\n}";
  data = data.replace("$body$", emailBody);
  data = data.replace("$sendTo$", sendTo);
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://xbx63fxnrh.execute-api.us-west-2.amazonaws.com/dev/v1/send",
    "method": "POST",
    "headers": {
      "x-api-key": "r3Rmv0cOlF7BHqjVBdYg8pcXMq3YKFc4DKZhkn8h",
      "Content-Type": "application/json"
    },
    "processData": false,
    "data": data
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}
