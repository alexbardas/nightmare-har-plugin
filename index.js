let path = require('path')

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

    Nightmare.action('waitForDevtools', (name, options, parent, win, renderer, done) => {
      parent.respondTo('waitForDevtools', (done) => {
        win.webContents.on('devtools-opened', () => done(null))
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
        partition: 'nopersist',
        preload: path.join(__dirname, 'preload.js')
      }
    }
  }
}
