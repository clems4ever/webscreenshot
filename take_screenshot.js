
var casper = require('casper').create({
    verbose: false,
    logLevel: "debug"
});
var params = JSON.parse(casper.cli.get('params'));
var config = params.config;

//console.log(JSON.stringify(params));
//console.log(JSON.stringify(config));

var url = params.url;
var output = params.output;

var username = (config.username) ? config.username : undefined;
var password = (config.password) ? config.password : undefined;

var width = (config.width) ? config.width : 1920;
var height = (config.height) ? config.height : 1280;
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
            'top': 0,
            'left': 0,
            'height': height,
            'width': width 
        });
    });
});

casper.run();
