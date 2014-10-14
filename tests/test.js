(function (require, module) {
  'use strict';

  var Color = require('../libs/types/color.js');
  var chance = require('chance').Chance();
  var MockServer = require('./mockServer.js');
  var logger = require('../libs/logger.js');

  // Chai Plugins
  var chai = require('chai');
  var chaiJsFactories = require('chai-js-factories');
  chai.use(chaiJsFactories);
  var clientFactory = require('./clientFactory.js');

  // Use expect style
  var expect = chai.expect;

  describe('client tests', function() {

    it('should send correct data to server', function(done) {
      var client = chai.factory.create('client');
      var aNumber = client.registerVar('aNumber', 5);
      var aString = client.registerVar('aString', 'stringme');
      var aColor = client.registerVar('aColor', new Color(1, 0, 0, 1));
      var _id = chance.apple_token();
      var started = false;

      client.addListener('connect', function(id) {
        expect(client._id).to.eql(_id);
        // Stop Server
        mockServer.server.close(done);
      });


      var mockServer = new MockServer(function (req, res) {

        // Initialise
        if (!started) {
          expect(req.url).to.match(/\/projects\/.+\/devices\/$/);
          expect(req.method).to.equal('PUT');
          expect(req.body)
            .to.have.property('projectId', client.projectId);
          expect(req.body)
            .to.have.property('projectVersion', client.projectVersion);
          expect(req.body)
            .to.have.property('deviceName', client.deviceName);

          // Send back _id
          res.statusCode = 200;
          var returnString = JSON.stringify({ _id: _id });
          res.setHeader('Content-Type', 'application/json');
          res.end(returnString);
          started = true;
        }

      });

      client.connect();

    });

  });

})(require, module);
