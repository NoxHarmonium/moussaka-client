// Main class
(function (require, module) {
  'use strict';

  var utils = require('./utils.js');
  var _ = require('lodash');
  var superagent = require('superagent');
  var logger = require('./logger.js');
  var Ref = require('./ref.js');
  var path = require('path');
  var EventEmitter = require('events')
    .EventEmitter;
  var inherits = require('util')
    .inherits;


  // # Required Params
  // deviceName:        The identifier for this client
  // apiKey:            User's API key for authentication
  // projectId:         The id of the associated project
  // projectVersion:    The version of this this application
  // # Params
  // serverUrl:         The server url (default: localhost:80)
  // pollInterval:      The rate to poll the server for updates (in ms)
  var MoussakaClient = function (opts) {

    // Defaults
    this.deviceName = null;
    this.apiKey = null;
    this.projectId = null;
    this.projectVersion = null;

    this.serverUrl = 'http://localhost:3000/';
    this.pollInterval = 1000; //ms

    _.assign(this, opts);

    // Fields
    this.registeredVars = {};
    this.connected = false;
    this.dataSchema = {};
    this.polling = false;
    this.intervalId = null;
    this.pollErrorCount = 0;
    this.pollReady = true;

    if (opts.logLevel) {
      logger.logLevel = opts.logLevel;
    }


  };

  // Inherit EventEmitter
  inherits(MoussakaClient, EventEmitter);

  MoussakaClient.prototype.getBaseUrl = function () {
    if (!this.serverUrl) {
      throw new Error('Server URL not defined.');
    }
    var str = this.serverUrl;
    if (str.substr(-1) === '/') {
      return str.substr(0, str.length - 1);
    }
    return str;
  };

  MoussakaClient.prototype.getErrorDetail = function (res) {
    var msg = 'An unknown error occurred';
    if (res.body && res.body.detail) {
      msg = res.body.detail;
    } else if (res.text) {
      msg = res.text;
    }
    return msg;
  };

  MoussakaClient.prototype.getStateSnapshot = function () {
    var snapshot = {};
    _.each(this.registeredVars, function (registeredVar, name) {
      snapshot[name] = registeredVar.ref.value;
    });
    return snapshot;
  };

  MoussakaClient.prototype.registerVar = function (name, value, schema) {
    if (this.registeredVars[name]) {
      throw new Error('Variable with that name already registered.');
    }

    var ref = new Ref(value);

    this.registeredVars[name] = {
      ref: ref,
      schema: schema
    };

    this.updateSchema();

    return ref;
  };

  MoussakaClient.prototype.updateSchema = function () {
    if (this.connected) {
      throw new Error('Cannot update schema after connect.');
    }

    var dataSchema = {};
    _.each(this.registeredVars, function (variable, name) {
      if (!variable.schema) {
        // Create a schema by guessing
        var type = null;
        var ref = variable.ref;

        logger.trace('Updating schema with: ' + name);
        logger.trace('Type: ' + typeof (ref.value));
        logger.trace('Complex: ' + !!ref.value.getType);

        switch (typeof (ref.value)) {
        case 'boolean':
          type = 'boolean';
          break;
        case 'number':
          type = 'float';
          break;
        case 'string':
          type = 'string';
          break;
        }

        if (ref.value.getType) {
          type = ref.value.getType();
        }

        if (!type) {
          throw new Error('Cannot deduce object type. ' +
            'Please pass in a schema object.');
        }

        variable.schema = {
          type: type
        };
      }

      dataSchema[name] = variable.schema;
    }, this);

    // Success!
    this.dataSchema = dataSchema;
  };

  MoussakaClient.prototype.connect = function () {
    utils.validateRequiredOptions(this, ['deviceName', 'apiKey',
      'projectId', 'projectVersion'
    ]);

    var url = this.getBaseUrl() + path.join('/projects/',
      this.projectId, 'devices/');
    logger.trace('Connecting device at: ' + url);

    superagent.put(url)
      .send({
        projectId: this.projectId,
        projectVersion: this.projectVersion,
        deviceName: this.deviceName,
        dataSchema: this.dataSchema,
        currentState: this.getStateSnapshot()
      })
      .set('apikey', this.apiKey)
      .end(function (e, res) {
        if (e) {
          return this.emit('error', e);
        }

        if (res.ok) {
          this.connected = true;
          this._id = res.body.data._id;
          logger.trace('Connected!: _id: ' + this._id);
          this.emit('connect', this._id);
          this.beginPolling();
        } else {
          this.emit('error', new Error('Server returned error: Status: ' +
            res.status + ' Detail: ' + this.getErrorDetail(res)));
        }

      }.bind(this));
  };

  MoussakaClient.prototype.disconnect = function () {
    utils.validateRequiredOptions(this, ['deviceName', 'apiKey',
      'projectId', 'projectVersion'
    ]);

    var url = this.getBaseUrl() + path.join('/projects/',
      this.projectId, 'devices/', this._id, '/');
    logger.trace('Disconnecting device at: ' + url);

    this.stopPolling();

    superagent.del(url)
      .set('apikey', this.apiKey)
      .end(function (e, res) {
        if (e) {
          return this.emit('error', e);
        }

        if (res.ok) {
          this.connected = false;
          this.emit('disconnect');
        } else {
          this.emit('error', new Error('Server returned error: Status: ' +
            res.status + ' Detail: ' + this.getErrorDetail(res)));
        }

      }.bind(this));
  };

  MoussakaClient.prototype.beginPolling = function () {
    if (!this.connected || this.polling) {
      throw new Error('This method should only be called by the ' +
        'connect function.');
    }

    logger.trace('Starting polling');

    this.intervalId = setInterval(this.pollFn.bind(this),
      this.pollInterval);
    this.polling = true;
  };

  MoussakaClient.prototype.pollFn = function () {
    utils.validateRequiredOptions(this, ['deviceName', 'apiKey',
      'projectId', 'projectVersion', '_id'
    ]);

    var url = this.getBaseUrl() + path.join('/projects/',
      this.projectId, 'sessions/', this._id, '/updates/');

    logger.trace('Polling with URL: ' + url);

    this.emit('poll');

    if (!this.pollReady) {
      logger.warn('pollFn called before last poll completed. ' +
        'Skipping poll. Make sure poll frequency is not to fast.');
    }

    this.pollReady = false;
    superagent.get(url)
      .set('apikey', this.apiKey)
      .end(function (e, res) {
        this.pollReady = true;
        if (e) {
          if (++this.pollErrorCount > 5) {
            logger.error('5 poll errors encountered in a row. ' +
              'Disconnecting...');
            this.disconnect();
          }
          return this.emit('error', e);
        }

        if (res.ok) {
          this.pollErrorCount = 0;
          this.applyUpdates(res.body.data);
        } else {
          return this.emit('error',
            new Error('Server returned error: Status: ' +
              res.status + ' Detail: ' + this.getErrorDetail(res)));
        }

      }.bind(this));
  };

  MoussakaClient.prototype.stopPolling = function () {
    logger.trace('Stopping polling');
    if (!this.intervalId && this.polling) {
      throw new Error('Polling started but no intervalId.');
    }
    if (!this.intervalId || !this.polling) {
      throw new Error('Polling has not been started.');
    }
    clearInterval(this.intervalId);
    this.polling = false;
  };

  MoussakaClient.prototype.applyUpdates = function (updates) {
    if (!updates) {
      logger.warn('Updates is null.');
      return;
    }

    _.each(updates, function (update, key) {
      var values = update.values;
      var variable = this.registeredVars[key];
      var type = variable.schema.type;
      var ref = variable.ref;

      switch (variable.schema.type) {
        // Primitives
      case 'float':
      case 'double':
      case 'decimal':
        ref.value = values.n;
        break;
      case 'string':
        ref.value = values.s;
        break;
      case 'boolean':
        ref.value = values.b;
        break;
      default:
        // Complex Type
        if (ref.value.setValues) {
          ref.value.setValues(values);
        } else {
          logger.warn('Unsupported variable type: ' + type);
        }
        break;
      }

    }, this);

  };

  module.exports = MoussakaClient;

})(require, module);
