// Variable wrapper
(function (require, module) {
  'use strict';

  var logger = require('./logger.js');

  var Ref = function (val) {
    var that = this;
    this.internalValue = val;
    this.internalType = typeof (val);

    Object.defineProperty(this, 'value', {
      get: function () {
        return that.internalValue;
      },
      set: function (value) {
        if (that.internalType !== typeof (value)) {
          logger.warn('Type of value: ' + typeof (value) +
            ' does not match type of reference: ' + that.internalType
          );
        }
        that.internalValue = value;
      }
    });

  };

  module.exports = Ref;

})(require, module);
