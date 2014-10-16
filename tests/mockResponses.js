(function (require, module) {
  'use strict';
    var logger = require('../libs/logger.js');
    var _ = require('lodash');
    var chai = require('chai');

    // Use expect style
    var expect = chai.expect;

    var MockResponses = function(client, _id) {
        var that = this;
        this.client = client;
        this.stats = {
            pollCount: 0
        };
        this.updates = {};
        this.fns = {
            '\/projects\/.+\/devices\/$': function(req, res) {
                var registeredVars = Object.keys(that.client.registeredVars);

                expect(req.method).to.equal('PUT');
                expect(req.headers)
                    .to.have.property('apikey');
                expect(req.body)
                    .to.have.property('projectId', client.projectId);
                expect(req.body)
                    .to.have.property('projectVersion', client.projectVersion);
                expect(req.body)
                    .to.have.property('deviceName', client.deviceName);
                expect(req.body)
                    .to.have.property('dataSchema');
                expect(Object.keys(req.body.dataSchema))
                    .to.have.length(registeredVars.length);
                expect(req.body)
                    .to.have.property('currentState');
                expect(Object.keys(req.body.currentState))
                    .to.have.length(registeredVars.length);

                _.each(req.body.currentState, function(value, key) {
                    expect(value)
                        .to.have.property('values');
                });

                // Send back _id
                res.statusCode = 200;
                var returnString = JSON.stringify({ data: { _id: _id }});
                res.setHeader('Content-Type', 'application/json');
                res.end(returnString);
            },
            '\/projects\/.+\/sessions\/.+\/updates\/$': function(req, res) {
                expect(req.method).to.equal('GET');
                expect(req.headers)
                    .to.have.property('apikey');
                that.stats.pollCount++;

                // Send back _id
                res.statusCode = 200;
                var returnString = JSON.stringify({data: that.updates});
                that.updates = {};
                res.setHeader('Content-Type', 'application/json');
                res.end(returnString);
           },
           '\/projects\/.+\/devices\/.+\/$': function(req, res) {
                expect(req.method).to.equal('DELETE');
                expect(req.headers)
                    .to.have.property('apikey');

                // Send back _id
                res.statusCode = 200;
                var returnString = JSON.stringify({ data: {} });
                res.setHeader('Content-Type', 'application/json');
                res.end(returnString);
            },
        };


    };

    module.exports = MockResponses;


})(require, module);
