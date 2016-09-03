#!/usr/bin/env node

var webscreenshot = require('../lib/webscreenshot');
var program = require('commander');

program
  .version('1.0.0')
  .option('-p, --port [port]', 'The port used by the REST API')
  .parse(process.argv);

var port = program.port || 8080

webscreenshot(port)
.then(function() {
    console.log('The WebScreenShot REST API is listening on port %d.', port);
});
