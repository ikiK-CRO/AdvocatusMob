import { Application } from '@nativescript/core'

import { HomeViewModel } from './home-view-model'

export function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new HomeViewModel()

  // page.bindingContext = {
  //   myFunction: () => {
  //     console.log(true)
  //   }
  // }

  page.bindingContext.set('test', test())

  function test () {
    let res = '<div style="color:red; min-height: 50px" >click me test</div>'
    return res
  }
  let html = page.getViewById('html')
  console.log(html)
  html.on("tap", (args) => {
    console.log(args)
});
}

export function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}
