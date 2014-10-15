// Utils
(function (require, module) {
  'use strict';

  var _ = require('lodash');
  var logger = require('./logger.js');

  module.exports = {
    validateRequiredOptions: function (object, keys, strict) {
      strict = strict || true;

      if (!object && keys.length > 0) {
        return false;
      }
      _.each(keys, function (key) {
        if (!_.contains(Object.keys(object), key)) {
          throw new Error('Missing required option: ' + key);
        }
        var value = object[key];
        if (typeof(value) === 'undefined' ||
          value === null ||
          (typeof(value) === 'string' && value.trim() === '')) {
            throw new Error('Option is undefined, null or empty string: ' + key);
        }
      });
      return true;
    }
  };

})(require, module);
