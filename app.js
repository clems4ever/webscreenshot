var express = require('express');
var app = express();
var exec = require('child_process').exec
var spawn = require('child_process').spawn
var path = require('path');
var bodyParser = require('body-parser');


var SERVICE_PORT = process.env.PORT || 8080;

app.use(bodyParser.json());



function dump(params, done) {
    var dumpFilepath = path.resolve('take_screenshot.js');

    var env = {}
    env.PATH = process.env.PATH + ':' + path.resolve('./node_modules/phantomjs/bin');
    var casperjs = spawn(path.resolve('./node_modules/casperjs/bin/casperjs'), ['--params=' + JSON.stringify(params), '--ignore-ssl-errors=yes', dumpFilepath], {
        env: env
    });

    casperjs.on('close', function(code) {
        done();
    });

    casperjs.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
    });

    casperjs.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
    });
}


function getDump(params, res) {
    dump(params, function() {
        res.sendFile(path.resolve('.', params.output));
    });
}

app.post('/screenshot', function(req, res) {
    params = {};
    params.config = {};

    var url = req.body.url;

    if(req.body.config) {
        var width = req.body.config.width;
        var height = req.body.config.height;
        var delay = req.body.config.delay;

        if(width)
            params.config.width = width;
        if(height)
            params.config.height = height;
        if(delay)
            params.config.delay = delay;
    
    }

    params.url = url;
    params.output = './output.png';

    console.log('Screenshot of', url, 'at', new Date());
    getDump(params, res);
});

app.listen(SERVICE_PORT, function() {
    console.log('Listening on port ' + 8080);
});
