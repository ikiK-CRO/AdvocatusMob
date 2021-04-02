import { Application } from '@nativescript/core'

import { BrowseViewModel } from './browse-view-model'

import { Label, GestureTypes } from '@nativescript/core'

export function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new BrowseViewModel()

  page.bindingContext.set('pretraga', pretraga)
  page.bindingContext.set('rezultat', getMessage(val))

  let btn = page.getViewById('btn')

  btn.on(GestureTypes.tap, function (args) {
    console.log('Tap')
    let res = page.getViewById('val').text
    let url = 'https://advocatus-test.appdiz-informatika.hr/api/api_V1.php'
    let req = url + '?apitest=' + res
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
        let result
        printValues(obj)
        page.bindingContext.set('rezultat', getMessage(result))
        console.log(result)

        function printValues (obj) {
          for (var k in obj) {
            if (obj[k] instanceof Object) {
              printValues(obj[k])
            } else {
              if (obj[k] != '' && obj[k] != undefined) {
                //viewModel.set('message', getMessage("test"))
                result += '<br>' + obj[k]
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
// export function onNavigatingTo(args: EventData) {
//   const page = args.object
//   const vm = fromObject({
//     years: years
//   })
//   page.bindingContext = vm
// }

// export function onListPickerLoaded(args) {
//   const listPickerComponent = args.object
//   listPickerComponent.on('selectedIndexChange', (data: EventData) => {
//     const picker = data.object as ListPicker
//     console.log(`index: ${picker.selectedIndex}; item" ${years[picker.selectedIndex]}`)
//   })
// }
