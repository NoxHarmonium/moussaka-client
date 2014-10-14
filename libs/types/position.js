// Position Type
(function (require, module) {
  'use strict';

  var utils = require('../utils.js');

  var Position = function (x, y, z) {
    if (arguments.length === 1) {
      if (typeof x === 'object') {
        // Alternate syntax (pass in object)
        var obj = x;
        this.setValues(obj);
      } else if (typeof x === 'number') {
        // Only one param, others are default
        this.x = x;
      } else {
        throw new Error('Value for x required.');
      }
    }

    // Defaults
    this.y = this.y || 0;
    this.z = this.z || 0;

    utils.validateRequiredOptions(this, ['x', 'y', 'z']);
  };

  Position.prototype.setValues = function (values) {
    utils.validateRequiredOptions(values, ['x']);
    this.x = values.x;
    this.y = values.y || 0;
    this.z = values.z || 0;
  };

  Position.prototype.getValues = function () {
    return {
      x: this.r,
      y: this.g,
      z: this.b,
    };
  };

  Position.prototype.getType = function () {
    return 'position';
  };

  module.exports = Position;

})(require, module);
