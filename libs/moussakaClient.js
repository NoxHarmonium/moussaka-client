// Main class
(function (require, module) {
  'use strict';

  var utils = require('./utils.js');
  var _ = require('lodash');
  var superagent = require('superagent');
  var resolveUrl = require('resolve-url');
  var logger = require('./logger.js');
  var Ref = require('./ref.js');

  // # Required Params
  // deviceName:        The identifier for this client
  // apiKey:            User's API key for authentication
  // projectId:         The id of the associated project
  // projectVersion:    The version of this this application
  // # Params
  // serverUrl:         The server url (default: localhost:80)
  // pollInterval:      The rate to poll the server for updates (in ms)
  var MoussakaClient = function (opts) {
    utils.validateRequiredOptions(opts, ['deviceName', 'apiKey',
      'projectId', 'projectVersion'
    ]);

    // Defaults
    this.serverUrl = 'localhost:80';
    this.pollInterval = 1000; //ms

    _.assign(this, opts);

    // Fields
    this.registedVars = {};
    this.connected = false;
    this.dataSchema = {};
    this.agent = superagent.agent();
    this.polling = true;
    this.intervalId = null;
    this.pollErrorCount = 0;
    this.pollReady = true;

  };

  MoussakaClient.prototype.registerVar = function (name, value, schema) {
    if (this.registedVars[name]) {
      throw new Error('Variable with that name already registered.');
    }

    var ref = new Ref(value);

    this.registedVars[name] = {
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
    _.each(this.registedVars, function (variable, name) {
      if (!variable.schema) {
        // Create a schema by guessing
        var type = null;

        switch (typeof (variable.ref)) {
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

        if (variable.ref.getType) {
          type = variable.ref.getType();
        }

        if (!type) {
          throw new Error('Cannot deduce object type. ' +
            'Please pass in a schema object.');
        }

        dataSchema[name] = {
          type: type
        };
      } else {
        dataSchema[name] = variable.schema;
      }
    });

    // Success!
    this.dataSchema = dataSchema;
  };

  MoussakaClient.prototype.connect = function () {
    var url = resolveUrl(this.serverUrl, '/projects/',
      this.projectId, 'devices/');
    logger.trace('Connecting device at: ' + url);
    this.agent.put(url)
      .send({
        projectId: this.projectId,
        projectVersion: this.projectVersion,
        deviceName: this.deviceName
      })
      .end(function (e, res) {
        if (e) {
          throw e;
        }

        if (res.ok) {
          this.connected = true;
          this._id = res.body._id;
          this.beginPolling();
        } else {
          throw new Error('Server returned error: Status: ' +
            res.status + ' Detail:' + res.body.detail);
        }

      }.bind(this));
  };

  MoussakaClient.prototype.disconnect = function () {
    var url = resolveUrl(this.serverUrl, '/projects/',
      this.projectId, 'devices/', this._id, '/');
    logger.trace('Disconnecting device at: ' + url);

    this.stopPolling();

    this.agent.del(url)
      .end(function (e, res) {
        if (e) {
          throw e;
        }

        if (res.ok) {
          this.connected = false;
        } else {
          throw new Error('Server returned error: Status: ' +
            res.status + ' Detail:' + res.body.detail);
        }

      }.bind(this));
  };

  MoussakaClient.prototype.beginPolling = function () {
    if (!this.connected || this.polling) {
      throw new Error('This method should only be called by the ' +
        'connect function.');
    }

    this.intervalId = setInterval(this.pollFn.bind(this),
      this.pollInterval);

  };

  MoussakaClient.prototype.pollFn = function () {
    var url = resolveUrl(this.serverUrl, '/projects/',
      this.projectId, 'sessions/', this._id, '/updates/');

    if (!this.pollReady) {
      logger.warn('pollFn called before last poll completed. ' +
        'Skipping poll. Make sure poll frequency is not to fast.');
    }

    this.pollReady = false;
    this.agent.get(url)
      .end(function (e, res) {
        this.pollReady = true;
        if (e) {
          if (++this.pollErrorCount > 5) {
            logger.error('5 poll errors encountered in a row. ' +
              'Disconnecting...');
            this.disconnect();
          }
          throw e;
        }

        if (res.ok) {
          this.pollErrorCount = 0;
          this.applyUpdates(res.body);
        } else {
          throw new Error('Server returned error: Status: ' +
            res.status + ' Detail:' + res.body.detail);
        }

      }.bind(this));
  };

  MoussakaClient.prototype.stopPolling = function () {
    clearInterval(this.intervalId);
  };

  MoussakaClient.prototype.applyUpdates = function (updates) {
    if (!updates) {
      logger.warn('Updates is null.');
      return;
    }

    _.each(updates, function (update, key) {
      var values = update.values;
      var variable = this.registedVars[key];
      var type = variable.schema.type;
      // If is complex type
      //variable.prop.set(x)
      //_.assign(variable.variable, value.values);

      switch (variable.schema.type) {
        // Primitives
      case 'float':
      case 'double':
      case 'decimal':
        variable.ref = values.n;
        break;
      case 'string':
        variable.ref = values.s;
        break;
      case 'boolean':
        variable.ref = values.b;
        break;
      default:
        // Complex Type
        if (variable.ref.setValues) {
          variable.ref.setValues(values);
        } else {
          logger.warn('Unsupported variable type: ' + type);
        }
        break;
      }

    });

  };

  return MoussakaClient;

})(require, module);
