/*
Test Automation Engineer: Francis Saul
Date started to create: 3/16/2020
*/

exports.config = {
  directConnect: true,
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args:['--start-maximized']
    }
  },
 
        
  // Framework to use. Jasmine is recommended.
  framework: 'jasmine',

  // This is only to run one spec file : ->>
  // specs: ['../tests/test2.js'],

  //Below is for Organize Test Suites to run
  suites: {
    POMSampleTest: '../tests/test2.js',
    OneBrowserOnly: '../tests/OneBrowserOnly.js'
  },

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  //For logs (tracing) 
  onPrepare: function () {
    
    const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
    //for HTML reports
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      consolidateAll: true,
      filePrefix: 'guitest-xmloutput',
      savePath: '.'
    }));

    //Getting screenshots
  var fs = require('fs-extra');
  fs.emptyDir('screenshots/', function (err) {
           console.log(err);
       });
       jasmine.getEnv().addReporter({
           specDone: function(result) {
               if (result.status == 'failed') {
                   browser.getCapabilities().then(function (caps) {
                       var browserName = caps.get('browserName');
                       browser.takeScreenshot().then(function (png) {
                           var stream = fs.createWriteStream('screenshots/' + browserName + '-' + result.fullName+ '.png');
                           stream.write(new Buffer.from(png, 'base64'));
                           stream.end();
                       });
                   });
               }
           }
       });
},
   

  //for Chart readable HTML reports
  onComplete: function() {
    var browserName, browserVersion;
    var capsPromise = browser.getCapabilities();
capsPromise.then(function (caps) {
       browserName = caps.get('browserName');
       browserVersion = caps.get('version');
       platform = caps.get('platform');
var HTMLReport = require('protractor-html-reporter-2');
testConfig = {
           reportTitle: 'Protractor Test Execution Report',
           outputPath: './',
           outputFilename: 'ProtractorTestReport',
           screenshotPath: './screenshots',
           testBrowser: browserName,
           browserVersion: browserVersion,
           modifiedSuiteName: false,
           screenshotsOnlyOnFailure: true,
           testPlatform: platform
       };
       new HTMLReport().from('guitest-xmloutput.xml', testConfig);
   });
}
};
