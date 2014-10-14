// Color Type
(function (require, module) {
  'use strict';

  var utils = require('../utils.js');

  var Color = function (r, g, b, a) {
    if (arguments.length === 1) {
      // Alternate syntax (pass in object)
      var obj = r;
      this.setValues(obj);
    } else if (arguments.length === 4) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    } else {
      throw new Error('Invalid number of arguments.');
    }

    utils.validateRequiredOptions(this, ['r', 'g', 'b', 'a']);
  };

  Color.prototype.setValues = function (values) {
    utils.validateRequiredOptions(values, ['r', 'g', 'b', 'a']);
    this.r = values.r;
    this.g = values.g;
    this.b = values.b;
    this.a = values.a;
  };

  Color.prototype.getValues = function () {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a
    };
  };

  Color.prototype.getType = function () {
    return 'color';
  };

  module.exports = Color;

})(require, module);
