#!/usr/bin/env node

var webscreenshot = require('../lib/webscreenshot');

var SERVICE_PORT = process.env.PORT || 8080;

webscreenshot(SERVICE_PORT);
