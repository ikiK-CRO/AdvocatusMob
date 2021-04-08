import {
  Application,
  ObservableArray,
  Observable,
  Frame
} from '@nativescript/core'
import { inboxMeniIkona } from '~/app'
import { FeaturedViewModel } from './featured-view-model'

export function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new FeaturedViewModel()

  let manuinbox = page.getViewById('manuinbox')
  let listView = page.getViewById('listView')

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

  let res = []
  let myObservableArray
  let url = 'https://advocatus-test.appdiz-informatika.hr/api/api_V1.php'
  let req = url + '?getporuke=kiki3'

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
          res.push({
            itemName: e['notif_dat'],
            itemDescription: e['notif_sadrzaj'],
            procitan: e['notif_stanje'],
            id: e['notif_id']
          })
        })
        myObservableArray = new ObservableArray(res)
        page.bindingContext.set('myObservableArray', myObservableArray)
      })
      .catch(error => console.error('FETCH ERROR:', error))
  }

  getPoruke()

  listView.on('pullToRefreshInitiated', function (eventData) {
    //console.log(true)
    //console.log(myObservableArray)
    getPoruke()
    setTimeout(function () {
      listView.notifyPullToRefreshFinished()
    }, 1000)
  })
}

export function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView()
  sideDrawer.showDrawer()
}

// export function onLeftSwipeClick (args) {
//   const listView = Frame.topmost().currentPage.getViewById('listView')
//   console.log('Označi pročitano')
//   let clickedItem = args.object.bindingContext
//   console.log(clickedItem)

//   listView.notifySwipeToExecuteFinished()
// }

// export function onRightSwipeClick (args) {
//   const listView = Frame.topmost().currentPage.getViewById('listView')
//   console.log('Obriši Swipe Klik')
//   //const viewModel = listView.bindingContext;
//   let clickedItem = args.object.bindingContext
//   console.log(clickedItem)
//   //viewModel.myObservableArray.splice(viewModel.myObservableArray.indexOf(args.object.bindingContext), 1);
//   listView.notifySwipeToExecuteFinished()
// }

//export function onPullToRefreshInitiated (args) {}
