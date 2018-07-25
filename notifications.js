'use strict';

(function() {
  $(document).ready(function() {
    tableau.extensions.initializeAsync().then(function() {
      var emails = ["derekhdawson@yahoo.com"]; // add your email here
      var emailBody = "<h1 style='color:#f4b342;'>your datasource was updated</h1>"; // add HTML for email body here
      sendEmail(emails, emailBody);
    })
  })
})();

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