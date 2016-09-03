
var express = require('express');
var requestify = require('requestify');
var should = require('should');
var webscreenshot = require('../lib/webscreenshot');

var SCREENSHOT_ENDPOINT = '/';

function serveExamplePage(req, res) {
    res.send('coucou'); 
}

function call(fn) {
    return function() {
        return fn();
    }
}

describe('Test webscreenshot REST API', function() {
    var MOCK_PORT = 9256;
    var TEST_PORT = 9257;
    var server = undefined;

    before(function(done) {
        var app = express();
        app.get('/', serveExamplePage);
        server = app.listen(MOCK_PORT);
        webscreenshot(TEST_PORT)
        .then(call(done));
    });

    after(function() {
        if(server) server.close();
    });

    describe('When a screenshot is requested from the REST API', function() {
        it('should return the image as a result', function(done) {
            requestify
            .post('http://localhost:9257' + SCREENSHOT_ENDPOINT, {
                config: {
                    width: 300,
                    height: 300,
                    delay: 500
                },
                url: 'http://localhost:9256'
            })
            .then(function(response) {
                should.equal(response.code, 200);
                should.equal(response.headers['content-type'], 'image/png');
                done();
            });
        });

        it('should return the image after the delay', function(done) {
            this.timeout(3000);

            var start = new Date();
            requestify
            .post('http://localhost:9257' + SCREENSHOT_ENDPOINT, {
                config: {
                    width: 300,
                    height: 300,
                    delay: 1500
                },
                url: 'http://localhost:9256'
            })
            .then(function(response) {
                var delta = new Date() - start;
                console.log(delta);
                delta.should.greaterThan(1500);
                done();
            });
        });
    });
});
