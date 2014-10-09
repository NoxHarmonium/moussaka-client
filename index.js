// Main entry point
(function (require, module) {
  'use strict';

  var Logger = require('./libs/logger.js');
  var logger = new Logger();

  logger.trace('moussaka-client-js is now loading...');

  logger.info('Not much to see here at the moment!');

  logger.trace('loading complete.');

})(require, module);
