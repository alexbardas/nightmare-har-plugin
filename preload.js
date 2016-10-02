let path = require('path')

window.__nightmare = {}
window.__nightmare.ipc = require('electron').ipcRenderer

;(() => {
  let BrowserWindow = require('electron').remote.BrowserWindow
  BrowserWindow.removeDevToolsExtension('devtools-har-extension')
  BrowserWindow.addDevToolsExtension(path.join(__dirname, 'devtools-har-extension'))
})()

