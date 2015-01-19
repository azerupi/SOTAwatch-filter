SOTAwatch filter
================

## Description

[SOTAwatch filter] (http://www.mathieudavid.org/webapps/sotawatchfilter/#/spotfilter) is a web application that gives you the ability to filter "spots" from [SOTAwatch.org](http://www.sotawatch.org/) based on some criteria like callsigns, summits, frequency, etc. 

You can find the page online at: http://www.mathieudavid.org/webapps/sotawatchfilter/#/spotfilter
*This repository is only to show the code behind the page and if someone wants to contribute*

## What is SOTA ?

**Summits on the Air (SOTA)** is an award scheme for radio amateurs and shortwave listeners that encourages portable operation in mountainous areas. For more information: http://www.sota.org.uk/

## Install

> **Note:** If you want to use the page, no need to install it. It is online at: http://www.mathieudavid.org/webapps/sotawatchfilter/#/spotfilter

#### If you want to learn, fiddle or contribute to SOTAwatch filter here is how:

**If it is not already done, install [Node.js](http://nodejs.org/) and [Grunt](http://gruntjs.com/getting-started)**

**Fork**

1. Fork this repository
2. Clone your fork on your hard drive
3. Open the folder in your terminal
4. type ```npm install``` to install the dependencies

**Make changes**

Now you are ready to make changes. When you made a change you will want to run Grunt. Type ```grunt``` in the terminal. This will 'compile' (concatenate, minify, ...) the last changes. To see your changes open your browser and open *index.html* in the 'production' folder.

Alternatively you can type ```grunt watch``` in the terminal before you make any changes. In this case grunt will watch the files and when you modify a file grunt will run it's magic automaticaly.

> The only files you will want to modify are the ones in the *development* folder.

**Pull Request**

When you feel you have made substantial improvements, you can (and should :wink:) make a pull request so that I can review your additions and add your improvements for the benefit of the whole SOTA community ! 

> **If you just want to take a look at the code it may be easier to just download the .zip file**


## License

This software and any derivative work may be redistributed as source code and or in binary form as long as it is NOT for commercial purpose. This includes selling but also making revenue on advertisements, etc.

**For more details read the [license file](LICENSE.md)**


--------------------

![SOTAwatch filter - filter page](/git_info/SOTAwatch_Filter_home.png)
