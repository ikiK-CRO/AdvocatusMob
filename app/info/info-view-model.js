import { fromObject } from '@nativescript/core'

import { SelectedPageService } from '../shared/selected-page-service'

export function InfoViewModel() {
  SelectedPageService.getInstance().updateSelectedPage('Info')

  const viewModel = fromObject({
    /* Add your view model properties here */
  })

  return viewModel
}
