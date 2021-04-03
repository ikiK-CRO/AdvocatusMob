import { Application } from '@nativescript/core'

import { BrowseViewModel } from './browse-view-model'

import { Label, GestureTypes } from '@nativescript/core'

export function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new BrowseViewModel()

  page.bindingContext.set('pretraga', pretraga)
  page.bindingContext.set('rezultat', getMessage(val))

  let btn = page.getViewById('btn')
  let kategorije = page.getViewById('kategorije')

let odabirKategorije = "Predmet pravni"

  kategorije.on('selectedIndexChange', lpargs => {
    const picker = lpargs.object
    // const kat= picker.selectedValue;
    // console.log(kat)
    //console.log(`ListPicker selected value: ${picker.selectedValue} ListPicker selected index: ${picker.selectedIndex}`);
    odabirKategorije = pretraga[picker.selectedIndex]
    console.log(odabirKategorije)
  })

  btn.on(GestureTypes.tap, function (args) {
    console.log('Tap')
    page.getViewById('busy').style.visibility="visible"
    
    let res = page.getViewById('val').text
    let listView = page.getViewById('listView')
    let url = 'https://advocatus-test.appdiz-informatika.hr/api/api_V1.php'
    let apiKat

    if(odabirKategorije==="Predmet pravni"){apiKat='?getpredmetpravni='}
    if(odabirKategorije==="Predmet Fizički"){apiKat='?getpredmetfiz='}
    


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
        //viewModel.set('message', getMessage(val))
        let result = []
        printValues(obj)
        // page.bindingContext.set('rezultat', getMessage(result))
        listView.animate({
          opacity: 1,
          duration: 700
        })
        page.getViewById('val').dismissSoftInput();
        page.bindingContext.set('rezultat', getMessage(result))
        console.log(result)
        page.getViewById('busy').style.visibility="collapse"
        page.getViewById('ikona').style.visibility="collapsed"

        function printValues (obj) {
          for (var k in obj) {
            if (obj[k] instanceof Object) {
              printValues(obj[k])
            } else {
              if (obj[k] != '' && obj[k] != undefined) {
                //viewModel.set('message', getMessage("test"))
                // result += '<br>' + obj[k]
                result.push({ res: obj[k] })
              }
            }
          }
        }
      })
      .catch(error => console.error('FETCH ERROR:', error))
  })
}

export function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}

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
