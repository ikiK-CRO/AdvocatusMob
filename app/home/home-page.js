import { Frame, Application} from '@nativescript/core'
import { HomeViewModel } from './home-view-model'
import { inboxMeniIkona } from '~/app'


//import { BarcodeScanner } from "nativescript-barcodescanner";
var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
let  barcodescanner = new BarcodeScanner();


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

  var SecureStorage = require('@nativescript/secure-storage').SecureStorage
  //import { secureStorage } from '@nativescript/secure-storage'
  // instantiate the plugin
  let secureStorage = new SecureStorage()

  // async
  secureStorage
    .set({
      key: 'test',
      value: 'test value'
    })
    .then(success => console.log('Successfully set a value? ' + success))
}

export function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}



export function scanBarcode () {

  requestPermission().then((result) => {
    //barcodescanner.scan(true, false);

    barcodescanner.scan({
          //cancelLabel: "Stop scanning",
          //message: "Go scan something",
          //preferFrontCamera: false,
          showFlipCameraButton: false
      }).then((result) => {
          console.log("Scan format: " + result.format);
          console.log("Scan text:   " + result.text);
      }, (error) => {
          console.log("No scan: " + error);
      });
  }, (error) => {
      console.log("ERROR", error);
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
