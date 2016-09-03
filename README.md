<p align="center">
  <img src="/docs/img/webscreenshot_logo.png" alt="Logo"/>
</p>
====================

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)][MIT License] [![Build Status](https://travis-ci.org/clems4ever/webscreenshot.svg?branch=master)](https://travis-ci.org/clems4ever/webscreenshot)

*WebScreenShot* allows you to take screenshots of webpages through a REST API.

# Usage 

Install webscreenshot on your computer 

    npm install -g webscreenshot

And start the service

    webscreenshotd --port 8080

To take a screenshot of a website, POST the following payload at the / endpoint

    curl -XPOST -H "Content-Type: application/json" -d '
    {
        "config": {
            "width": 1600, 
            "height": 1000, 
            "top": 0, 
            "left": 0, 
            "delay": 1000
        }, 
        "url": "https://github.com/clems4ever/webscreenshot"
    }' localhost:8080/ > example.png 

After about 1 second, you receive the image. 

## Parameters

Below is the list of available parameters

| Parameter       | Description                                                       |
|-----------------|-------------------------------------------------------------------|
| url             | The url to take a screenshot of.                                  |
| config.width    | The width of the viewport in pixels.                              |
| config.height   | The height of the viewport in pixels.                             |
| config.top      | The vertical shift regarding the top of the page in pixels.       |
| config.left     | The horizontal shift regarding the left ot page in pixels.        |
| config.delay    | The delay to wait before the screenshot is taken in milliseconds. |
| config.username | The username to use for basic authentication.                     |
| config.password | The password to use for basic authentication.                     |

# Contributing to WebScreenShot

Follow [contributing](CONTRIBUTING.md) file.

License
---------------------

WebScreenShot is **licensed** under the **[MIT License]**. The terms of the license are as follows:

    The MIT License (MIT)

    Copyright (c) 2016 - Clement Michaud

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[MIT License]: https://opensource.org/licenses/MIT
