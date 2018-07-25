'use strict';

$(document).ready(function () {
  tableau.extensions.initializeAsync().then(function () {
      showCurrentlySelectedWorksheets();
  }, function (err) {
    // Something went wrong in initialization.
    console.log('Error while Initializing: ' + err.toString());
  });
});

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
