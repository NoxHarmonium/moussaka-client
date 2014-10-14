// Utils
(function (require, module) {
  'use strict';

  var _ = require('lodash');
  var logger = require('./logger.js');

  return {
    validateRequiredOptions: function (object, keys) {
      _.each(keys, function (key) {
        if (!_.contains(Object.keys(object), key)) {
          throw new Error('Missing required option: ' + key);
        }
      });
      return true;
    }
  };

})(require, module);
