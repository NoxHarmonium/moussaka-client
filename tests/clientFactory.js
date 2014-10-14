(function (require, module) {
  'use strict';

  var MoussakaClient = require('../libs/MoussakaClient.js');
  var chance = require('chance').Chance();
  var _ = require('lodash');

  var chai = require('chai');
  if (!chai.factory) {
    throw new Error('You need to make sure the chai js-factories plugin' +
      'is installed (chai.use(chaiJsFactories);)');
  }

  chai.factory.define('client', function (args) {

    // Required Params
    // deviceName:        The identifier for this client
    // apiKey:            User's API key for authentication
    // projectId:         The id of the associated project
    // projectVersion:    The version of this this application

    var defaultArgs = {
        deviceName: chance.name(),
        apiKey: chance.guid(),
        projectId: chance.guid(),
        projectVersion: chance.word()
    };

    args = _.assign(defaultArgs, args);

    return new MoussakaClient(args);
  });

})(require, module);
