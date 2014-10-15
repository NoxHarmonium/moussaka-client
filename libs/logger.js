// Logging
(function (require, module) {
  'use strict';

  var sprintf = require('sprintf-js')
    .sprintf;

  var Logger = function (logLevel) {
    this.logLevel = logLevel ||
      this.severity.warning.level;
  };

  Logger.prototype.severity = {
    'trace': {
      label: 'trace',
      level: 0
    },
    'info': {
      label: 'info',
      level: 1
    },
    'warning': {
      label: 'warning',
      level: 2
    },
    'error': {
      label: 'error',
      level: 3
    },
    'exception': {
      label: 'exception',
      level: 4
    }
  };

  Logger.prototype.log = function (severity, msg) {
    if (!severity) {
      severity = this.severity.info;
    }

    if (!msg) {
      msg = 'No message provided in log statement.';
    }

    if (severity.level >= this.logLevel) {
      console.log(sprintf('[%s] [%s]: %s', (new Date())
        .toLocaleTimeString(),
        severity.label,
        msg));
    }

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

  module.exports = new Logger();


})(require, module);
