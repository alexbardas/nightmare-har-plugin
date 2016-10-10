nightmare-har-plugin
====================

[![Build Status](https://travis-ci.org/alexbardas/nightmare-har-plugin.svg?branch=master)](https://travis-ci.org/alexbardas/nightmare-har-plugin)

- [What is nightmare-har-plugin?](#what-is-nightmare-har-plugin)
- [Nightmare extended API](#nightmare-extended-api)
- [Plugin API](#plugin-api)
- [Install](#install)
- [Usage](#usage)
- [Community](#community)

### What is nightmare-har-plugin?

[Nightmarejs](https://nightmarejs.org) plugin that uses the [electron](http://electron.atom.io) devtools to capture the network activity of an http request in HAR (HTTP Archive) format.

It extends the nightmare behaviour with 2 extra methods: `getHAR()` and `waitForDevtools()`. It also contains a chrome devtools extension used to retrieve the network activity.


### Nightmare extended API
##### `.waitForDevtools()`
Waits for devtools to open so all network requests can be captured. If not executed before the first `goto()` method, the first requests may be lost because of the async behavior of opening the devtools.

##### `.getHAR()`
Retrives the HAR information as a json.


### Plugin API
##### `.install(Nightmare)`
Installs the extra methods using the Nightmare's `action` API.

##### `.getDevtoolsOptions()`
Returns an object with some default devtools options Nightmare needs in order to open devtools shortly after initialization.


### Install

```sh
npm install nightmare-har-plugin
```


### Usage

```js
let Nightmare = require('nightmare')
let harPlugin = require('nightmare-har-plugin')

harPlugin.install(Nightmare)

let options = {
  waitTimeout: 1000
}

let nightmare = Nightmare(Object.assign(harPlugin.getDevtoolsOptions(), options))

nightmare
  .waitForDevtools()
  .goto('http://news.ycombinator.com')
  .wait('#hnmain')
  .getHAR()
  .end()
  .then((result) => console.log(JSON.stringify(result)))
  .catch((error) => console.error(error))
```


### Community

- [Network-har](https://github.com/alexbardas/network-har) makes use of this plugin to provide a nodejs CLI script and a docker image to easily retrieve network activity for an http request by running electron in headless mode inside the docker container.
