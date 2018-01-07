WDIO Allure Reporter [![Build Status](https://travis-ci.org/webdriverio/wdio-allure-reporter.svg?branch=master)](https://travis-ci.org/webdriverio/wdio-allure-reporter) [![Code Climate](https://codeclimate.com/github/webdriverio/wdio-allure-reporter/badges/gpa.svg)](https://codeclimate.com/github/webdriverio/wdio-allure-reporter)
====================

> A WebdriverIO reporter plugin to create [Allure Test Reports](http://allure.qatools.ru/).

## Installation

The easiest way is to keep `wdio-allure-reporter` as a devDependency in your `package.json`.

```json
{
  "devDependencies": {
    "wdio-allure-reporter": "~0.1.2"
  }
}
```

You can simple do it by:

```bash
npm install wdio-allure-reporter --save-dev
```

Instructions on how to install `WebdriverIO` can be found [here](http://webdriver.io/guide/getstarted/install.html).

## Configuration
Configure the output directory in your wdio.conf.js file:

```js
exports.config = {
    // ...
    reporters: ['allure'],
    reporterOptions: {
		allure: {
			outputDir: 'allure-results'
		}
	},
	// ...
}
```

`outputDir` defaults to `./allure-results`. After a test run is complete, you will find that this directory has been populated with an `.xml` file for each spec, plus a number of `.txt` and `.png` files and other attachments.

## Custom attachments

You can save custom attachments to tests/steps by calling `process.send` to `allure:attachment` within your hook:

```js
afterStep: function (step) {
    var serverLogs = getServerLogsSomehow();
    
    process.send({
        event: 'allure:attachment',
        test: step.getStep().getName(), // The name of the test to attach this to
        name: 'Server logs', // The name that this attachment should get in the report
        content: '<pre style="font-family: SFMono-Regular, Consolas, ' +
            '\'Liberation Mono\', Menlo, Courier, monospace; font-size: 12px">' +
            serverLogs.replace(/\n/g, '<br>') + '</pre>',
        mimeType: 'text/html',
    });
}
```

Until [webdriverio/webdriverio#1893](https://github.com/webdriverio/webdriverio/pull/1893) lands, there is no certain way to connect your hook with the specific Allure report being assembled for that test run; for now, we check the current open Allure reports for the one that has the most recent test with the name you send here via the `test` property, and this attachment is added to that test. If by coincidence there are two in-progress Allure reports that both have a most-recent test with the same name, the attachment will only be added to the first one.

If you send HTML, Allure will display it as rich HTML—even with images, if you include an `img src` with a base64-encoded data URI. This is another way to include custom images in your output:

```js
afterStep: function (step) {
    var image = new Buffer(require('fs').readFileSync('download.png')).toString('base64');
    
    process.send({
        event: 'allure:attachment',
        test: step.getStep().getName(),
        name: 'Downloaded image',
        content: '<img src="data:image/png;base64,' + image + '">',
        mimeType: 'text/html',
    });
}
```

If you leave out `mimeType`, plain text is assumed. If you send `application/json`, the JSON will be pretty-printed with four spaces.

## Displaying the report
The results can be consumed by any of the [reporting tools](https://docs.qameta.io/allure#_reporting) offered by Allure. For example:

### Jenkins
Install the [Allure Jenkins plugin](https://docs.qameta.io/allure#_jenkins), and configure it to read from the correct directory:
![screenshot 2016-02-05 10.10.30.png](./docs/images/jenkins-config.png)

Jenkins will then offer a link to the results from the build status page:
![screenshot 2016-02-05 10.12.08.png](./docs/images/jenkins-results.png)

If you open a report at the first time you probably will notice that Jenkins won't serve the assets due to security restrictions. If that is the case go to Jenkins script console (`http://<your_jenkins_instance>/script`) and put in these security settings:

```
System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';")
System.setProperty("jenkins.model.DirectoryBrowserSupport.CSP", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';")
```

Apply and restart the Jenkins server. All assets should now be served correctly.

### Command-line
Install the [Allure command-line tool](https://www.npmjs.com/package/allure-commandline), and process the results directory:
```bash
allure generate [allure_output_dir] && allure open
```
This will generate a report (by default in `./allure-report`), and open it in your browser:
![screenshot 2016-02-05 10.15.57.png](./docs/images/browser.png)

----

For more information on WebdriverIO see the [homepage](http://webdriver.io).

## Development

### Integration Tests
Integration Tests are running webdriverio multiple times using the wdio-allure-reporter and verifying the output.

Run http server to serve test pages:
```
./node_modules/.bin/static ./test/fixtures
```
Run tests:
```
npm test
```
