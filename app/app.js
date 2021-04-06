import { Application } from '@nativescript/core'


var firebase = require("@nativescript/firebase").firebase;
firebase.init({
    // Optionally pass in properties for database, authentication and cloud messaging,
    // see their respective docs.
    onMessageReceivedCallback: function(message) {
        console.log(message)
        // console.log("Title: " + message.title);
        // console.log("Body: " + message.body);
        // // if your server passed a custom property called 'foo', then do this:
        // console.log("Value of 'foo': " + message.data.foo);
      }
  }).then(
      function () {
        console.log("firebase.init done");
      },
      function (error) {
        console.log("firebase.init error: " + error);
      }
  );

  
Application.run({ moduleName: 'app-root/app-root' })

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
