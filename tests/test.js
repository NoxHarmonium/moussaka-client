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

    var client;
    var aNumber;
    var aString;
    var aColor;

    it('should register vars without error', function(done) {
      client = chai.factory.create('client');
      aNumber = client.registerVar('aNumber', 5);
      aString = client.registerVar('aString', 'stringme');
      aColor = client.registerVar('aColor', new Color(1, 0, 0, 1));
      done();
    });

    it('should send correct data to server', function(done) {
      var _id = chance.apple_token();

      client.addListener('connect', function(id) {
        expect(client._id).to.eql(_id);
        done();
      });

      // Intercept
      var mockServer = new MockServer(function (req, res) {

        // PUT project
        if ((/\/projects\/.+\/devices\/$/i).test(req.url)) {
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
        } else {
          throw new Exception('Unrecognized url');
        }
      });

      client.connect();

    });

  });

})(require, module);
