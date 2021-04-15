import { Frame, Application} from '@nativescript/core'
import { HomeViewModel } from './home-view-model'
import { inboxMeniIkona } from '~/app'


import { BarcodeScanner } from "nativescript-barcodescanner";
///var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;

let reg



export function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new HomeViewModel()

  let manuinbox = page.getViewById('manuinbox')

  async function asyncCall () {
    //console.log('calling')
    const result = await inboxMeniIkona()
    //console.log(result)
    if (result != '0') {
      manuinbox.color = 'rgb(255, 136, 0)'

      const animation1 = manuinbox.createAnimation({
        opacity: 0.3,
        duration: 1000
      })
      const animation2 = manuinbox.createAnimation({
        opacity: 1,
        duration: 1000
      })
      animation1
        .play()
        .then(() => {
          return animation2.play()
        })
        .then(() => {
          return animation1.play()
        })
        .then(() => {
          return animation2.play()
        })
    }
  }
  asyncCall()
  setInterval(function () {
    asyncCall()
  }, 4000)

  manuinbox.on('tap', args => {
    console.log('manuinbox')

    Frame.topmost().navigate({
      moduleName: 'featured/featured-page',
      transition: {
        name: 'fade'
      }
    })
  })





  //async
  

  var SecureStorage = require('@nativescript/secure-storage').SecureStorage
  //import { secureStorage } from '@nativescript/secure-storage'
  // instantiate the plugin
  let secureStorage = new SecureStorage()
  secureStorage.get({
    key: "registracija"
  }).then(
    function(value) {
      console.log(value);
      if (value === null){
        scanBarcode ()
      }else{
       console.log(value)
      }
    }
  );



}

export function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}

let barcodescanner




export function scanBarcode () {
  barcodescanner = new BarcodeScanner();
  requestPermission().then((result) => {
    //barcodescanner.scan(true, false);
    barcodescanner.scan({
      formats: "QR_CODE,PDF_417",   // Pass in of you want to restrict scanning to certain types
      cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
      cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
      message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
      showFlipCameraButton: true,   // default false
      preferFrontCamera: false,     // default false
      showTorchButton: true,        // default false
      beepOnScan: true,             // Play or Suppress beep on scan (default true)
      fullScreen: true,             // Currently only used on iOS; with iOS 13 modals are no longer shown fullScreen by default, which may be actually preferred. But to use the old fullScreen appearance, set this to 'true'. Default 'false'.
      torchOn: false,               // launch with the flashlight on (default false)
      closeCallback: function () { console.log("Scanner closed"); }, // invoked when the scanner was closed (success or abort)
      resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
      orientation: "portrait",     // Android only, optionally lock the orientation to either "portrait" or "landscape"
      openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
    }).then(
        function(result) {
          console.log("Scan format: " + result.format);
          console.log("Scan text:   " + result.text);
          req = result.text
          var SecureStorage = require('@nativescript/secure-storage').SecureStorage
          //import { secureStorage } from '@nativescript/secure-storage'
          // instantiate the plugin
          let secureStorage = new SecureStorage()
          secureStorage.set({
            key: 'registracija',
            value: req
          })
          .then(success => console.log('Successfully set a value? ' + success))

        },
        function(error) {
          console.log("No scan: " + error);
        }
    );
    });
}


export function requestPermission() {
  return new Promise((resolve, reject) => {
    barcodescanner.available().then((available) => {
      if(available) {
        barcodescanner.hasCameraPermission().then((granted) => {
              if(!granted) {
                barcodescanner.requestCameraPermission().then(() => {
                      resolve("Camera permission granted");
                      console.log("Camera permission granted")
                  });
              } else {
                  resolve("Camera permission was already granted");
                  console.log("Camera permission was already granted")
              }
          });
      } else {
          reject("This device does not have an available camera");
          console.log("This device does not have an available camera")
      }
  });
  });
}

console.log(true)