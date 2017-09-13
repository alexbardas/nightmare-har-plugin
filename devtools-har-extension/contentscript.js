/* global chrome */
(function (window, chrome) {
  window.__sendPageTimings = function () {
    var page = {
      'pageTimings': {
        'onContentLoad': window.performance.timing.domContentLoadedEventEnd - window.performance.timing.fetchStart,
        'onLoad': window.performance.timing.loadEventEnd - window.performance.timing.fetchStart
      },
      'startedDateTime': new Date(window.performance.timing.fetchStart).toISOString(),
      'title': window.location.href
    }

    chrome.runtime.sendMessage({
      source: 'devtools-har-extension',
      type: 'page',
      data: page
    })
  }

  window.addEventListener('load', function () {
    setTimeout(function () {
      window.__sendPageTimings()
    }, 1)
  })

  window.addEventListener('beforeunload', function () {
    if (window.performance.timing.loadEventEnd === 0) {
      window.__sendPageTimings()
    }
  })
})(window, chrome)
