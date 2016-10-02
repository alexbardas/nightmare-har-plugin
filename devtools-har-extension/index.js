const REQUEST_FINISHED_URL = 'chrome://version/?get-har'

let send = (channel, msg) => {
  window.chrome.devtools.inspectedWindow.eval(
    `__nightmare.ipc.send("${channel}", ${JSON.stringify(msg)})`
  )
}

let sendHAR = () => {
  window.chrome.devtools.network.getHAR((har) => {
    har.entries = har.entries.filter((entry) => entry.request.url !== REQUEST_FINISHED_URL)
    send('har-data', har)
  })
}

window.chrome.devtools.network.onRequestFinished.addListener((request) => {
  if (request.request.url === REQUEST_FINISHED_URL) {
    sendHAR()
  }
})
