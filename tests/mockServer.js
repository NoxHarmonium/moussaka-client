(function (require, module) {
  'use strict';
    var logger = require('../libs/logger.js');

    var MockServer = function(cb, port) {
        port = port || 3000;
        var connect = require('connect')
        var http = require('http')

        var app = connect()

        // parse urlencoded request bodies into req.body
        var bodyParser = require('body-parser')
        app.use(bodyParser.json())

        // respond to all requests
        app.use(function(req, res){
          cb(req, res);
        })

        //create node.js http server and listen on port
        logger.info('Mock server started on port: ' + port)
        this.server = http
            .createServer(app)
            .listen(port);
    };

    module.exports = MockServer;

})(require, module);
