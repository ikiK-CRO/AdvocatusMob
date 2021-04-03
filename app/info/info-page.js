import { Application } from '@nativescript/core'

import { InfoViewModel } from './info-view-model'

export function onNavigatingTo(args) {
  const page = args.object
  page.bindingContext = new InfoViewModel()
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}
