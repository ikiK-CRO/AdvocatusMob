import { Application } from '@nativescript/core'

import { BrowseViewModel } from './browse-view-model'

import { EventData, fromObject, ListPicker, Page } from '@nativescript/core'

export function onNavigatingTo(args) {
  const page = args.object
  page.bindingContext = new BrowseViewModel()
  page.bindingContext.set('years', years)
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}

const years = ["Predmet pravni","Predmet Fizički", "Stranka Pravna", "Strnaka Fizička"]




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