'use strict';

(function() {
  $(document).ready(function() {
    tableau.extensions.initializeAsync().then(function() {
      showCurrentlySelectedWorksheets();
    })
  })
})();

setInterval(refreshDataSource, 10000);

// Refreshes the given dataSource.
 function refreshDataSource (dataSource) {
   var oldDataSource = dataSource;
    dataSource.refreshAsync().then(function () {
       console.log(dataSource.name + ': Refreshed Successfully');
       if (oldDataSource != dataSource){
         var emails = ["derekhdawson@yahoo.com"]; // add your email here
         var emailBody = "<h1 style='color:#f4b342;'>your datasource was updated</h1>"; // add HTML for email body here
         sendEmail(emails, emailBody);
       }
    });
  }

var selectedWorksheets = [];
/**
* Shows the choose sheet UI. Once a sheet is selected, the data table for the sheet is shown
*/
function showSheetsDialog() {
  // Clear out the existing list of sheets
  $('#choose_sheet_buttons').empty();

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

function closeContactDialog() {
  $('#choose_contacts_dialog').modal('toggle');
  refresh();
}

function refresh() {
  showCurrentlySelectedWorksheets();
  showCurrentlySelectedContacts();
}

function showCurrentlySelectedWorksheets() {
  $('#currently_selected_sheets').empty();
  selectedWorksheets.forEach(function(worksheet) {
    const div = $("<div class='selected_worksheet sheet_name'>" + worksheet.name +"</div>");
    $('#currently_selected_sheets').append(div);
  });
}

function showCurrentlySelectedContacts() {
  $('#currently_selected_contacts').empty();
  selectedContacts.forEach(function(contact) {
    const div = $("<div class='selected_worksheet sheet_name'>" + contact.name +"</div>");
    $('#currently_selected_contacts').append(div);
  });
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}


function Contact(name, email) {
    this.name = name;
    this.email= email;
}

var myContacts = [
    new Contact("Cate", "cguyman@tableau.com"),
    new Contact("Laurel", "laurel.haeger@outlook.com"),
    new Contact("Derek", "ddawson@tableau.com"),
    new Contact("Arathi", "arathis269@utexas.edu"),
];

var selectedContacts = [];

function showContactsDialog() {
  console.log("here");
  // Clear out the existing list of sheets
  $('#choose_contact_buttons').empty();
  // Next, we loop through all of these worksheets add add buttons for each one
  myContacts.forEach(function (contact) {
    // Declare our new button which contains the sheet name
    const button = $("<input type='checkbox' class='btn btn-default btn-block'>" + contact.name +"</input>");
    if (isInArray(contact, selectedContacts)) {
      button.prop("checked", true);
    }
    // Create an event handler for when this button is clicked
    button.click(function () {
      // Get the worksheet name which was selected
      const contactName = contact.name;

      // Close the dialog and show the data table for this worksheet
      $('#choose_notification_dialog').modal('toggle');
      if (isInArray(contact, selectedContacts)) {
        var index =selectedContacts.indexOf(contact);
        selectedContacts.splice(index, 1);
      } else {
        selectedContacts.push(contact);
      }
    });

    // Add our button to the list of worksheets to choose from
    $('#choose_contact_buttons').append(button);
  }, this);

  // Show the dialog
  $('#choose_contacts_dialog').modal('toggle');
}

function sendEmailSetup() {
  var emails = [];
  var emailBody = "<h1 style='color:#f4b342;'>your datasource was updated</h1>"; // add HTML for email body here
  selectedContacts.forEach(function(contact) {
    emails.push(contact.email);
  });
  sendEmail(emails, emailBody);
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

function showAddContactForum() {
  $('#add_contacts_dialog').modal('toggle');
}

function closeAddContactDialog() {
  var contactName = $('#name_input').val();
  var contactEmail = $('#email_input').val();
  var contact = new Contact(contactName, contactEmail);
  myContacts.push(contact);
  $('#add_contacts_dialog').modal('toggle');
}
