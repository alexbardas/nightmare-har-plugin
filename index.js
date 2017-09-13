module.exports = {
  install: (Nightmare) => {
    Nightmare.action('getHAR', (name, options, parent, win, renderer, done) => {
      parent.respondTo('getHAR', (done) => {
        renderer.on('har-data', (event, har) => {
          done(null, har)
        })
        win.webContents.executeJavaScript('new Image().src = "chrome://version?get-har"')
      })
      done()
    }, function (done) {
      this.child.call('getHAR', done)
    })

    Nightmare.action('resetHAR', (name, options, parent, win, renderer, done) => {
      parent.respondTo('resetHAR', (done) => {
        renderer.on('har-reset', (event) => {
          done(null)
        })
        win.webContents.executeJavaScript('new Image().src = "chrome://version?reset-har"')
      })
      done()
    }, function (done) {
      this.child.call('resetHAR', done)
    })

    Nightmare.action('waitForDevtools', (name, options, parent, win, renderer, done) => {
      parent.respondTo('waitForDevtools', (done) => {
        win.webContents.on('devtools-opened', () => {
          let path = require('path')
          let BrowserWindow = require('electron').BrowserWindow
          BrowserWindow.removeDevToolsExtension('devtools-har-extension')
          BrowserWindow.addDevToolsExtension(path.dirname(require.resolve('nightmare-har-plugin/devtools-har-extension')))
          done(null)
        })
      })
      done()
    }, function (done) {
      this.child.call('waitForDevtools', done)
    })

    return Nightmare
  },
  getDevtoolsOptions: () => {
    return {
      show: true,
      openDevTools: {
        mode: 'detach'
      },
      webPreferences: {
        partition: 'nopersist'
      }
    }
  }
}
