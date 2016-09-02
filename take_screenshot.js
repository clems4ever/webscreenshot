// The MIT License (MIT)
// Copyright (c) 2016 - Clement Michaud
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



// This script must be executed with casperjs


var casper = require('casper').create({
    verbose: false,
    logLevel: "info"
});
var params = JSON.parse(casper.cli.get('params'));
var config = params.config;

console.log(JSON.stringify(params));
console.log(JSON.stringify(config));

var url = params.url;
var output = params.output;

if(!url || !output) {
    process.exit(1);
}

var username = (config.username) ? config.username : undefined;
var password = (config.password) ? config.password : undefined;

var width = (config.width) ? config.width : 1920;
var height = (config.height) ? config.height : 1280;
var _top = (config.top) ? config.top : 0;
var _left = (config.left) ? config.left : 0;

var delay = (config.delay) ? config.delay : 5000;


casper.start();

if(username && password) {
    casper.setHttpAuth(username, password);
    casper.options.pageSettings = {
        loadImages:true,
        loadPlugins:true,
        'userName': username, 
        'password': password
    };
    
    casper.page.customHeaders = {
        'Authorization': 'Basic '+btoa(username + ':' + password)
    };
}

casper.then(function() {
    this.viewport(width, height);
    console.log('Set viewport', width + 'x' + height);
});

casper.thenOpen(url, function() {
    this.wait(delay, function () {
        console.log('capture');
        casper.capture(output, {
            'top': _top,
            'left': _left,
            'height': height,
            'width': width 
        });
    });
});

casper.run();
