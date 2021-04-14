import { Frame, Application, Enums } from '@nativescript/core'
import { HomeViewModel } from './home-view-model'
import { inboxMeniIkona } from '~/app'

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
      animation1.play().then(() => {
        return animation2.play()
      }).then(() => {
        return animation1.play()
      }).then(() => {
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


  var SecureStorage = require("@nativescript/secure-storage").SecureStorage;
  //import { secureStorage } from '@nativescript/secure-storage'
  // instantiate the plugin
  let secureStorage = new SecureStorage();
  
  // async
  secureStorage.set({
    key: "test",
    value: "test value"
  }).then(success => console.log("Successfully set a value? " + success));





}

export function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}

