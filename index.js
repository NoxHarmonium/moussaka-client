// Main entry point
(function (require, module) {
  'use strict';

  // Load main module
  var logger = require('./libs/logger.js');
  var MoussakaClient = require('./libs/moussakaClient.js');

  // Expose types
  MoussakaClient.types = {};
  MoussakaClient.types.Color = require('./libs/types/color.js');
  MoussakaClient.types.Position = require('./libs/types/position.js');

  // Export
  logger.trace('MoussakaClient module loaded.');
  module.exports = MoussakaClient;

})(require, module);
