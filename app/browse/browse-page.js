import { Frame, Application, Dialogs } from '@nativescript/core'
import { inboxMeniIkona } from '~/app'
import { BrowseViewModel } from './browse-view-model'
import { Label, GestureTypes } from '@nativescript/core'
import { Enums } from '@nativescript/core'

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
  const page = args.object
  page.bindingContext = new BrowseViewModel()

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

  const pretraga = [
    'Predmet pravni',
    'Predmet Fizički',
    'Stranka Pravna',
    'Stranka Fizička'
  ]

  function getMessage (val) {
    if (val !== '') {
      return val
    } else {
      return '...'
    }
  }

  let val = ''
  page.bindingContext.set('pretraga', pretraga)
  page.bindingContext.set('rezultat', getMessage(val))

  let btn = page.getViewById('btn')
  let kategorije = page.getViewById('kategorije')
  let input = page.getViewById('val')
  let lista = page.getViewById('listView')
  let show = page.getViewById('show')

  let odabirKategorije = 'Predmet pravni'

  kategorije.on('selectedIndexChange', lpargs => {
    const picker = lpargs.object
    odabirKategorije = pretraga[picker.selectedIndex]
  })

  btn.on(GestureTypes.tap, function (args) {
    //console.log('Tap')
    loader.show(options)

    let res = page.getViewById('val').text
    if (res == '') {
      showAlertDialog()
    } else {
      //page.getViewById('busy').style.visibility = 'visible'

      let listView = page.getViewById('listView')
      let url = 'https://advocatus-test.appdiz-informatika.hr/api/api_V1.php'
      let apiKat
      let objNovi

      if (odabirKategorije === 'Predmet pravni') {
        apiKat = '?getpredmetpravni='
      }
      if (odabirKategorije === 'Predmet Fizički') {
        apiKat = '?getpredmetfiz='
      }

      if (odabirKategorije === 'Stranka Pravna') {
        apiKat = '?getstrprav='
      }
      if (odabirKategorije === 'Stranka Fizička') {
        apiKat = '?getstrfiz='
      }

      let req = url + apiKat + res
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
          let obj = data
          let result = []

          console.log(obj)
          if (odabirKategorije === 'Predmet pravni') {
            objNovi = [
              { key: 'Protustranka:', data: obj[0]['predp_PROTUSTRANKA'] },
              { key: 'Predmet:', data: obj[0]['predp_PREDMET'] },
              { key: 'Sud:', data: obj[0]['predp_SUD'] },
              { key: 'Sudski broj:', data: obj[0]['predp_SUDBROJ'] },
              { key: 'VPS:', data: obj[0]['predp_VPS'] },
              { key: 'Satnica:', data: obj[0]['predp_satnica'] },
              { key: 'Grad:', data: obj[0]['predp_grad'] },
              { key: 'Poštanski broj:', data: obj[0]['predp_post_br'] },
              { key: 'Adresa:', data: obj[0]['predp_adresa'] },
              { key: 'Javni bilježnik:', data: obj[0]['predp_jb'] },
              { key: 'Upravno tjelo:', data: obj[0]['predp_upr_tj'] },
              { key: 'Sudac:', data: obj[0]['predp_sudac'] },
              { key: 'Datum pokretanja:', data: obj[0]['predp_datum'] },
              { key: 'Status:', data: obj[0]['predp_status'] },
              { key: 'Zaduženi odvjetnici:', data: obj[0]['predp_odv'] },
              { key: 'Napomene:', data: obj[0]['predp_napo'] },
              { key: 'Predmet dadan:', data: obj[0]['predp_dodan'] },
              { key: 'Stanje:', data: obj[0]['predp_stanje'] },
              { key: 'Zadnja izmjena:', data: obj[0]['predp_izmjena'] },
              { key: 'OIB:', data: obj[0]['predp_oib'] },
              { key: 'Faza:', data: obj[0]['predp_faza'] }
            ]
          }
          if (odabirKategorije === 'Predmet Fizički') {
            objNovi = [
              { key: 'Protustranka:', data: obj[0]['predf_PROTUSTRANKA'] },
              { key: 'Predmet:', data: obj[0]['predf_PREDMET'] },
              { key: 'Sud:', data: obj[0]['predf_SUD'] },
              { key: 'Sudski broj:', data: obj[0]['predf_SUDBROJ'] },
              { key: 'VPS:', data: obj[0]['predf_VPS'] },
              { key: 'Satnica:', data: obj[0]['predf_satnica'] },
              { key: 'Grad:', data: obj[0]['predf_grad'] },
              { key: 'Poštanski broj:', data: obj[0]['predf_post_br'] },
              { key: 'Adresa:', data: obj[0]['predf_adresa'] },
              { key: 'Javni bilježnik:', data: obj[0]['predf_jb'] },
              { key: 'Upravno tjelo:', data: obj[0]['predf_upr_tj'] },
              { key: 'Sudac:', data: obj[0]['predf_sudac'] },
              { key: 'Datum pokretanja:', data: obj[0]['predf_datum'] },
              { key: 'Status:', data: obj[0]['predf_status'] },
              { key: 'Zaduženi odvjetnici:', data: obj[0]['predf_odv'] },
              { key: 'Napomene:', data: obj[0]['predf_napo'] },
              { key: 'Predmet dadan:', data: obj[0]['predf_dodan'] },
              { key: 'Stanje:', data: obj[0]['predf_stanje'] },
              { key: 'Zadnja izmjena:', data: obj[0]['predf_izmjena'] },
              { key: 'OIB:', data: obj[0]['predf_oib'] },
              { key: 'Faza:', data: obj[0]['predf_faza'] }
            ]
          }
          if (odabirKategorije === 'Stranka Fizička') {
            objNovi = [
              { key: 'Naziv stranke:', data: obj[0]['strf_NAZIV'] },
              { key: 'OIB:', data: obj[0]['strf_OIB'] },
              { key: 'Email:', data: obj[0]['strf_EMAIL'] },
              { key: 'Adresa:', data: obj[0]['strf_ADRESA'] },
              { key: 'Telefon:', data: obj[0]['strf_TELEFON'] },
              { key: 'Kontakt osobe:', data: obj[0]['strf_ko_os'] },
              { key: 'Grad / PO:', data: obj[0]['strf_grad'] },
              { key: 'Status:', data: obj[0]['strf_status'] },
              { key: 'Stranka dodana:', data: obj[0]['strf_dodan'] },
              { key: 'Zadnja izmjena:', data: obj[0]['strf_izmjena'] },
              { key: 'Napomene:', data: obj[0]['strf_napo'] }
            ]
          }
          if (odabirKategorije === 'Stranka Pravna') {
            objNovi = [
              { key: 'Naziv stranke:', data: obj[0]['strp_NAZIV'] },
              { key: 'OIB:', data: obj[0]['strp_OIB'] },
              { key: 'Email:', data: obj[0]['strp_EMAIL'] },
              { key: 'Adresa:', data: obj[0]['strp_ADRESA'] },
              { key: 'Telefon:', data: obj[0]['strp_TELEFON'] },
              { key: 'Kontakt osobe:', data: obj[0]['strp_ko_os'] },
              { key: 'Grad / PO:', data: obj[0]['strp_grad'] },
              { key: 'Status:', data: obj[0]['strp_status'] },
              { key: 'Stranka dodana:', data: obj[0]['strp_dodan'] },
              { key: 'Zadnja izmjena:', data: obj[0]['strp_izmjena'] },
              { key: 'Napomene:', data: obj[0]['strp_napo'] }
            ]
          }
          console.log(objNovi)
          //printValues(obj)

          listView.animate({
            opacity: 1,
            duration: 700
          })

          page.getViewById('val').dismissSoftInput()
          // page.bindingContext.set('rezultat', getMessage(result))
          // page.bindingContext.set('rezultat', objNovi)
          //page.getViewById('busy').style.visibility = 'collapse'
          page.getViewById('ikona').style.visibility = 'collapsed'

          let hide = [kategorije, input, btn]

          hide.forEach(
            e => (e.style.visibility = 'collapsed')
            //   .animate({
            //     translate: { x: 0, y: -200 },
            //     duration: 1000
            //   })
          )
          show.style.visibility = 'visible'
          page.getViewById('show').animate({
            opacity: 1,
            duration: 700
          })

          page.bindingContext.set('valPretraga', res)
          page.bindingContext.set('rezultat', objNovi)

          lista.animate({
            height: '97%',
            duration: 1000
          })
          loader.hide()
        })
        .catch(error => console.error('FETCH ERROR:', error))
    }
  })

  show.on(GestureTypes.tap, function (args) {
    console.log(true)
    show.style.visibility = 'collapsed'
    page.getViewById('listView').style.opacity = '0'

    kategorije.style.visibility = 'visible'
    input.style.visibility = 'visible'
    btn.style.visibility = 'visible'
    page.getViewById('ikona').style.visibility = 'visible'
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
    console.log('manuinfo')
  })
}

export function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}

// get taped item fomr list and its content
export function onItemTap (args) {
  //console.log("Touch arguments: ", args);
  var tappedView = args.view,
    tappedItem = tappedView.bindingContext
  console.log(tappedItem)
}

export function showAlertDialog () {
  const alertOptions = {
    title: 'Upozorenje!',
    message: 'Polje Naš broj ne smije biti prazno.',
    okButtonText: 'OK',
    cancelable: false // [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
  }

  Dialogs.alert(alertOptions).then(() => {
    console.log('alert')
  })
}

function clearTextfieldFocus (args) {
  var layout = args.object
  var myTextfield = layout.getViewById('val')
  myTextfield.android.clearFocus()
}
exports.clearTextfieldFocus = clearTextfieldFocus
