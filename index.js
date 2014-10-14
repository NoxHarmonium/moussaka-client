// Main entry point
(function (require, module) {
  'use strict';

  var logger = require('./libs/logger.js');
  var MoussakaClient = require('./libs/moussakaClient.js');

  module.exports = MoussakaClient;

})(require, module);
