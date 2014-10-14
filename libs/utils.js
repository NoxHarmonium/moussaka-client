// Utils
(function (require, module) {
  'use strict';

  var _ = require('lodash');
  var logger = require('./logger.js');

  module.exports = {
    validateRequiredOptions: function (object, keys) {
      if (!object && keys.length > 0) {
        return false;
      }
      _.each(keys, function (key) {
        if (!_.contains(Object.keys(object), key)) {
          throw new Error('Missing required option: ' + key);
        }
      });
      return true;
    }
  };

})(require, module);
