'use strict';

$(document).ready(function () {
  tableau.extensions.initializeAsync().then(function () {

  }, function (err) {
    // Something went wrong in initialization.
    console.log('Error while Initializing: ' + err.toString());
  });
});

function showSheetsDialog() {
  $('#choose_sheet_dialog').modal('toggle');
  showChooseSheetDialog ();
}

/**
* Shows the choose sheet UI. Once a sheet is selected, the data table for the sheet is shown
*/
function showChooseSheetDialog () {
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
    const button = $("<button type='button' class='btn btn-default btn-block'></button>");
    button.text(worksheet.name);

    // Create an event handler for when this button is clicked
    button.click(function () {
      // Get the worksheet name which was selected
      const worksheetName = worksheet.name;

      // Close the dialog and show the data table for this worksheet
      $('#choose_sheet_dialog').modal('toggle');
      loadSelectedMarks(worksheetName);
    });

    // Add our button to the list of worksheets to choose from
    $('#choose_sheet_buttons').append(button);
  });

  // Show the dialog
  $('#choose_sheet_dialog').modal('toggle');
}

function loadSelectedMarks (worksheetName) {
  // For now, just pop up an alert saying that we've selected a sheet
  alert(`Loading selected marks for ${worksheetName}`);
}
