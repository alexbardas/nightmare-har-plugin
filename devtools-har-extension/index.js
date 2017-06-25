const REQUEST_FINISHED_URL = 'chrome://version/?get-har'
const REQUEST_RESET_URL = 'chrome://version/?reset-har'

let har = {
  'version': '1.2',
  'creator': { 'name': '', 'version': '' },
  'entries': [],
  'pages': []
}

let pageRef = 0

let send = (channel, msg) => {
  window.chrome.devtools.inspectedWindow.eval(
    `__nightmare.ipc.send("${channel}", ${JSON.stringify(msg)})`
  )
}

window.chrome.devtools.network.getHAR((info) => {
  har.creator.name = info.creator.name
  har.creator.version = info.creator.version
})

window.chrome.devtools.network.onRequestFinished.addListener((request) => {
  switch (request.request.url) {
    case REQUEST_FINISHED_URL:
      send('har-data', har)
      break
    case REQUEST_RESET_URL:
      har.entries = []
      har.pages = []
      pageRef = 1
      send('har-reset')
      break
    default:
      har.entries.push(Object.assign({}, request, { 'pageref': 'page_' + pageRef }))
      break
  }
})

window.chrome.devtools.network.onNavigated.addListener((request) => {
  pageRef += 1
})

// Create a connection to the background page
let backgroundPageConnection = window.chrome.runtime.connect({
  name: 'panel'
})

backgroundPageConnection.postMessage({
  name: 'init',
  tabId: window.chrome.devtools.inspectedWindow.tabId
})

backgroundPageConnection.onMessage.addListener(function (message) {
  if (message.type === 'page') {
    har.pages.push(Object.assign({ 'id': 'page_' + pageRef }, message.data))
  }
})
