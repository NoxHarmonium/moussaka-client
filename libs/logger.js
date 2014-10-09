// Logging
(function (require, module) {
  'use strict';

  var sprintf = require('sprintf-js')
    .sprintf;

  var Logger = function () {};

  Logger.prototype.severity = {
    'trace': 0,
    'info': 1,
    'warning': 2,
    'error': 3,
    'exception': 4
  };

  Logger.prototype.log = function (severity, msg) {
    if (!severity) {
      severity = this.severity.info;
    }

    if (!msg) {
      msg = 'No message provided in log statement.';
    }

    console.log(sprintf('[%s] [%s]: %s', (new Date())
      .toLocaleTimeString(),
      severity,
      msg));

  };
  Logger.prototype.trace = function (msg) {
    this.log(this.severity.trace, msg);
  };
  Logger.prototype.info = function (msg) {
    this.log(this.severity.info, msg);
  };
  Logger.prototype.warning = function (msg) {
    this.log(this.severity.warning, msg);
  };
  Logger.prototype.error = function (msg) {
    this.log(this.severity.error, msg);
  };
  Logger.prototype.exception = function (msg) {
    this.log(this.severity.exception, msg);
  };

  module.exports = Logger;


})(require, module);
