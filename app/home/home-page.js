import { Frame, Application } from '@nativescript/core'

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
      manuinbox.color = 'orange'
    }
  }

  setInterval(function () {
    asyncCall()
  }, 3000)

  manuinbox.on('tap', args => {
    console.log('manuinbox')

    Frame.topmost().navigate({
      moduleName: "featured/featured-page",
      transition: {
        name: 'fade'
      }
    })
  })
}

export function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}
