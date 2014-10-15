(function (require, module) {
  'use strict';

  var Color = require('../libs/types/color.js');
  var chance = require('chance').Chance();
  var MockServer = require('./mockServer.js');
  var logger = require('../libs/logger.js');
  var MockResponses = require('./mockResponses.js');

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
    var _id = chance.guid();
    var mockResponses;

    // Setup Intercept
    var mockServer = new MockServer(function (req, res) {
      var matchFound = false;
      for (var pattern in mockResponses.fns) {
        var regex = new RegExp(pattern,'i');
        if (regex.test(req.url)) {
          mockResponses.fns[pattern](req, res);
          matchFound = true;
          break;
        }
      }

      if (!matchFound) {
        throw new Error('No matching fn found.');
      }
    }, 3333);

    it('should register vars without error', function() {
      client = chai.factory.create('client');
      aNumber = client.registerVar('aNumber', 5);
      aString = client.registerVar('aString', 'stringme');
      aColor = client.registerVar('aColor', new Color(1, 0, 0, 1));
      mockResponses = new MockResponses(client, _id);
    });

    it('should connect to server', function(done) {

      client.on('connect', function() {
        expect(client._id).to.eql(_id);
        done();
      });

      client.connect();

    });

    it('should poll regularly', function(done) {
      logger.info('Waiting for 5 seconds to test polling');
      setTimeout(function() {
        // Variability for slow test VMs
        expect(mockResponses.stats.pollCount)
          .to.be.within(4, 5);
        done();
      }, 5000);
    });

    it('should apply updates', function(done) {
      mockResponses.updates = {
        'aNumber': {
          values: { n: 50 }
        },
        'aString': {
          values: { s: 'newString' }
        },
        'aColor': {
          values: { r: 0, g: 0, b: 1, a: 0.5 }
        }
      };

      logger.info('Waiting for 2 seconds to test updates');

      setTimeout(function() {
        expect(aNumber.value)
          .to.eql(50);
        expect(aString.value)
          .to.eql('newString');
        expect(aColor.value)
          .to.have.property('r', 0);
        expect(aColor.value)
          .to.have.property('g', 0);
        expect(aColor.value)
          .to.have.property('b', 1);
        expect(aColor.value)
          .to.have.property('a', 0.5);
        done();
      }, 2000);
    });

   it('should disconnect without errors and stop polling', function(done) {
     client.on('disconnect', function() {
        mockResponses.stats.pollCount = 0;
        logger.info('Waiting for 2 seconds to check if polling stopped');
          setTimeout(function() {
            // Variability for slow test VMs
            expect(mockResponses.stats.pollCount)
              .to.eql(0);
            done();
          }, 2000);
      });

      client.disconnect();

    });



  });

})(require, module);
