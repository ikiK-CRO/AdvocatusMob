import { Frame, Application } from '@nativescript/core'
import { AppRootViewModel } from './app-root-view-model'
import { inboxMeniIkona } from '~/app'
var SecureStorage = require('@nativescript/secure-storage').SecureStorage
//import { secureStorage } from '@nativescript/secure-storage'
// instantiate the plugin
let secureStorage = new SecureStorage()

export function onLoaded (args) {
  const drawerComponent = args.object
  drawerComponent.bindingContext = new AppRootViewModel()

  let manuinbox = drawerComponent.getViewById('manuinbox')
  let office = drawerComponent.getViewById('office')
  let user = drawerComponent.getViewById('user')

  async function asyncCall () {
    //console.log('calling')
    const result = await inboxMeniIkona()
    //console.log(result)
    if (result != '0') {
      manuinbox.color = 'rgb(255, 136, 0)'

      const animation1 = manuinbox.createAnimation({
        opacity: 0.1,
        duration: 1500
      })
      const animation2 = manuinbox.createAnimation({
        opacity: 1,
        duration: 1500
      })
      animation1.play().then(() => {
        return animation2.play()
      })
    }
  }
  asyncCall()
  setInterval(function () {
    asyncCall()
  }, 3000)

  secureStorage.set({
    key: 'registracija',
    value: "1data:https://advocatus-test.appdiz-informatika.hr/api/api_V1.php 2data:kiki 3data:Appdiz Informatika"
  })
  .then(success => console.log('Successfully set a value? ' + success))



  secureStorage
    .get({
      key: 'registracija'
    })
    .then(function (value) {
      //console.log(value)
      //value = null
      //value = "1data:https://advocatus-test.appdiz-informatika.hr/api/api_V1.php 2data:kiki 3data:Appdiz Informatika";

      if (value === null) {
        scanBarcode()
      } else {
        //console.log(value)
        let a = value.split('2data:')
        let a2 = a[0].split('1data:')
        let api = a2[1]
        let kor = a[1].split(' 3data:')
        let korisnik = kor[0]
        let ured = kor[1]

        office.text = ured
        user.text = korisnik
        password.focus()

        //console.log(api)
        //console.log(korisnik)
        showSnackbar('DOBRODOŠLI')
      }
    })
}

export function onNavigationItemTap (args) {
  const component = args.object
  const componentRoute = component.route
  const componentTitle = component.title
  const bindingContext = component.bindingContext

  bindingContext.set('selectedPage', componentTitle)

  Frame.topmost().navigate({
    moduleName: componentRoute,
    transition: {
      name: 'fade'
    }
  })

  const drawerComponent = Application.getRootView()
  drawerComponent.closeDrawer()
}
