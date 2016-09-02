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

function addEntry(object, key, value) {
    var newObject = clone(object);
    newObject[key] = value;
    return newObject;
}

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

function resolvedPromise(args) {
    var deferred = Q.defer();
    deferred.resolve(args);
    return deferred.promise;
}

function rejectedPromise(args) {
    var deferred = Q.defer();
    deferred.reject(args);
    return deferred.promise;
}

function promisify(fn, context) {
    return function() {
        var defer = Q.defer();
        var args = Array.prototype.slice.call(arguments);

        args.push(function(err, val) {
            if (err !== null) {
                return defer.reject(err);
            }
            return defer.resolve(val);
        });
        fn.apply(context || {}, args);
        return defer.promise;
    }
}




function addPhantomJsToPath(env) {
    return addEntry(env, 'PATH', env.PATH + ':' + path.resolve('./node_modules/phantomjs/bin'));
}

function spawnCasperJs(params, env) {
    var dumpScriptPath = path.resolve('take_screenshot.js');
    var casperjs = spawn(path.resolve('./node_modules/casperjs/bin/casperjs'), 
                         ['--params=' + JSON.stringify(params), '--ignore-ssl-errors=yes', dumpScriptPath], {
        env: env
    });

    return casperjs;
}

function executeCasperJsScript(params, env) {
    var deferred = Q.defer();
    var casperjs = spawnCasperJs(params, env)

    casperjs.on('exit', function(code) {
        deferred.resolve();
    });

    //casperjs.stdout.on('data', (data) => {
    //      console.log(`stdout: ${data}`);
    //});

    //casperjs.stderr.on('data', (data) => {
    //      console.log(`stderr: ${data}`);
    //});
    return deferred.promise;
}

function addOutputFilename(params, imageFilename) {
    return addEntry(params, 'output', imageFilename);
}

function produceDumpImage(params, imageFilename, env) {
    var env = addPhantomJsToPath(env);
    var params = addOutputFilename(params, imageFilename);
    return function() {
        return executeCasperJsScript(params, env);
    }
}

function extractParams(req) {
    params = {};
    params.config = {};
    var url = req.body.url;

    if(req.body.config) {
        var width = req.body.config.width;
        var height = req.body.config.height;
        var top = req.body.config.top;
        var left = req.body.config.left;
        var delay = req.body.config.delay;

        if(width)
            params.config.width = width;
        if(height)
            params.config.height = height;
        if(top)
            params.config.top = top;
        if(left)
            params.config.left = left;

        if(delay)
            params.config.delay = delay;
        
    }
    params.url = url;
    return params;
}

function promisedSend(res) {
    return function(filename) { 
        var deferred = Q.defer();
        res.sendFile(filename, undefined, function(err) {
            if(err) {
                deferred.reject(err);
            }
            deferred.resolve();
        });

        return deferred.promise;
    }
}

function sendDumpImage(res, filename) {
    var send = promisedSend(res);
    return function() {
        return send(filename);
    }
}


function _executeInSequence(fns) {
    if(fns <= 0) {
         return resolvedPromise();
    }

    var fn = fns[0];
    var tailFns = fns.slice(1);
    return function() {
        var promise = fn();
        if(tailFns.length > 0) {
            promise.then(_executeInSequence(tailFns))
        }
        return promise;
    }
}

function executeInSequence(fns) {
    return _executeInSequence(fns)();
}

function removeFile(filename) {
    var unlink = promisify(fs.unlink);
    return function() {
        return unlink(filename);
    }
}


function logBeginOfDump(url) {
    return function() {
        console.log('Begin dump ', '"' + url + '"', 'at', new Date());
        return resolvedPromise();
    }
}

function logEndOfDump(url) {
    return function() {
        console.log('End dump ', '"' + url + '"', 'at', new Date());
        return resolvedPromise();
    }
}

function serveDump(env) {
   return function(req, res) {
       var temporaryDumpFilename = path.resolve('/tmp', uuid.v4() + '.png');
       var params = extractParams(req);

       executeInSequence([ 
           logBeginOfDump(params.url),
           produceDumpImage(params, temporaryDumpFilename, env),
           sendDumpImage(res, temporaryDumpFilename),
           removeFile(temporaryDumpFilename),
           logEndOfDump(params.url)
       ])
       .fail(function(err) {
           console.log('Error', err);
       });
   };
}


var express = require('express');
var app = express();
var spawn = require('child_process').spawn
var path = require('path');
var bodyParser = require('body-parser');
var Q = require('q');
var fs = require('fs');
var uuid = require('node-uuid');


var SERVICE_PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.post('/screenshot', serveDump(process.env));

app.listen(SERVICE_PORT, function() {
    console.log('Listening on port ' + 8080);
});
