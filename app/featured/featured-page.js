import {
  Application,
  ObservableArray,
  Observable,
  Frame,
  Dialogs
} from '@nativescript/core'
import { inboxMeniIkona } from '~/app'
import { FeaturedViewModel } from './featured-view-model'

const LoadingIndicator = require('@nstudio/nativescript-loading-indicator')
  .LoadingIndicator
const Mode = require('@nstudio/nativescript-loading-indicator').Mode

const loader = new LoadingIndicator()

// optional options
// android and ios have some platform specific options
const options = {
  message: 'Učitavanje...',
  details: '',
  progress: 0.65,
  margin: 50,
  dimBackground: true,
  color: 'white', // color of indicator and labels
  // background box around indicator
  // hideBezel will override this if true
  backgroundColor: '#607d8b',
  userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
  hideBezel: false // default false, can hide the surrounding bezel
  //mode: Mode.AnnularDeterminate, // see options below
  // android: {
  //   view: android.view.View, // Target view to show on top of (Defaults to entire window)
  //   cancelable: true,
  //   cancelListener: function (dialog) {
  //     console.log('Loading cancelled');
  //   },
  // },
  // ios: {
  //   view: UIView, // Target view to show on top of (Defaults to entire window)
  // },
}
// loader.show(options); // options is optional

// // Do whatever it is you want to do while the loader is showing, then
// setTimeout(() => {
//   loader.hide();
// }, 3000);

export function onNavigatingTo (args) {
  loader.show(options)

  const page = args.object
  page.bindingContext = new FeaturedViewModel()

  let manuinbox = page.getViewById('manuinbox')
  let listView = page.getViewById('listView')
  let inprovjera
  let result

  async function asyncCall () {
    //console.log('calling')
    result = await inboxMeniIkona()

    if (isNaN(result) === false && inprovjera != result) {
      inprovjera = result
      getPoruke()
      console.log('promjena')
    }

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

  
  let res = []
  let myObservableArray
  let url = 'https://advocatus-test.appdiz-informatika.hr/api/api_V1.php'
  let req = url + '?getporuke=kiki'

  function getPoruke () {
    fetch(req)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('NETWORK RESPONSE ERROR')
        }
      })
      .then(data => {
        //console.log(data)
        res = []

        data.forEach(e => {
          let text = e['notif_sadrzaj']
          let h = strip(text)
          h = h.replace(':    PRIKAŽI', '')
          res.push({
            itemName: e['notif_dat'],
            itemDescription: h,
            procitan: e['notif_stanje'],
            id: e['notif_id']
          })
        })
        myObservableArray = new ObservableArray(res)
        page.bindingContext.set('myObservableArray', myObservableArray)
        listView.animate({
          opacity: 1,
          duration: 700
        })
        loader.hide()
      })
      .catch(error => console.error('FETCH ERROR:', error))
  }

  listView.on('pullToRefreshInitiated', function (eventData) {
    //console.log(true)
    //console.log(myObservableArray)
    getPoruke()
    setTimeout(function () {
      listView.notifyPullToRefreshFinished()
    }, 1000)
  })

  let logoHome = page.getViewById('logoHome')
  logoHome.on('tap', args => {
    console.log('logoHome')

    Frame.topmost().navigate({
      moduleName: 'home/home-page',
      transition: {
        name: 'fade'
      }
    })
  })

  let manuinfo = page.getViewById('manuinfo')
  manuinfo.on('tap', args => {
    console.log('info ikona')
    showAlertDialog()
  })
}

export function showAlertDialog () {
  const alertOptions = {
    title: 'INFO',
    message:
      '- LISTA SE SAMA OSVJEŽUJE NA DOBIVENU PORUKU\n\n- POVUCI PREMA DOLJE ZA RUČNO OSVJEŽITI LISTU \n\n- JEDAN TAP NA PORUKU ZA OZNAČITI KAO PROČITANO \n\n- DVA TAP-A ZA OBRISATI PORUKU',
    okButtonText: 'OK',
    cancelable: false // [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
  }

  Dialogs.alert(alertOptions).then(() => {
    console.log('OK Info')
  })
}

export function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}

export function onItemTap (args) {
  //console.log("Touch arguments: ", args);
  var tappedView = args.view,
    tappedItem = tappedView.bindingContext
  console.log(tappedItem)
  console.log(tappedItem.id)
}

function strip (text) {
  let res = text
    .replace(/<style[^>]*>.*<\/style>/gm, '')
    // Remove script tags and content
    .replace(/<script[^>]*>.*<\/script>/gm, '')
    // Remove all opening, closing and orphan HTML tags
    .replace(/<[^>]+>/gm, '')
    // Remove leading spaces and repeated CR/LF
    .replace(/([\r\n]+ +)+/gm, '')

  return res
}
