#!/usr/bin/env node

var webscreenshot = require('../lib/webscreenshot');
var program = require('commander');

var DEFAULT_PORT = 8080;

program
  .version('1.0.0')
  .option('-p, --port [port]', 'The port used by the REST API (default is ' + DEFAULT_PORT +').')
  .parse(process.argv);

var port = program.port || DEFAULT_PORT; 

webscreenshot(port)
.then(function() {
    console.log('The WebScreenShot REST API is listening on port %d.', port);
});
