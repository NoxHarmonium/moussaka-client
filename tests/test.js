(function (require, module) {
  'use strict';

  var Color = require('../libs/types/color.js');
  var Position = require('../libs/types/position.js');
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
    var aPosition;
    var _id = chance.guid();
    var mockResponses;
    var pollInterval = 50;
    var pollsToCheck = 5;

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
      client = chai.factory.create('client', { pollInterval: 50 });
      aNumber = client.registerVar('aNumber', 5);
      aString = client.registerVar('aString', 'stringme');
      aColor = client.registerVar('aColor', new Color(1, 0, 0, 1));
      aPosition = client.registerVar('aPosition', new Position(22, 56));
      mockResponses = new MockResponses(client, _id);
    });

    it('should throw error if missing var', function() {
      var badClient = chai.factory.create('client', { projectId: null });
      expect(badClient.connect)
        .to.throw(Error);
    });

    it('should connect to server', function(done) {

      client.on('connect', function() {
        try {
          expect(client._id).to.eql(_id);
          done();
        } catch(ex) {
            done(ex);
        }
      });

      client.connect();

    });

    it('should poll regularly', function(done) {
      logger.info('Waiting to test polling');
      mockResponses.stats.pollCount = 0;
      setTimeout(function() {
        try {
          // Variability for slow test VMs
          expect(mockResponses.stats.pollCount)
            .to.be.within(pollsToCheck - 1, pollsToCheck + 1);
          done();
        } catch(ex) {
            done(ex);
        }
      }, pollInterval * pollsToCheck);
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
        },
        'aPosition': {
          values: { x: 3, y: 2, z: 1 }
        }
      };

      logger.info('Waiting for to test updates');

      setTimeout(function() {
        try {
            expect(aNumber.value)
              .to.eql(50);
            expect(aString.value)
              .to.eql('newString');
            expect(aColor.value)
              .to.include({ r: 0, g: 0, b: 1, a: 0.5 });
            expect(aPosition.value)
              .to.include({ x: 3, y: 2, z: 1 });
            done();
          } catch(ex) {
            done(ex);
          }
      }, pollInterval * 5);
    });

   it('should disconnect without errors and stop polling', function(done) {
     client.on('disconnect', function() {
        mockResponses.stats.pollCount = 0;
        logger.info('Waiting to check if polling stopped');
          setTimeout(function() {
            try {
              // Variability for slow test VMs
              expect(mockResponses.stats.pollCount)
                .to.eql(0);
              done();
            } catch(ex) {
              done(ex);
            }

          }, pollInterval * 5);
      });

      client.disconnect();

    });



  });

})(require, module);
