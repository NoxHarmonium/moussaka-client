// Main entry point
(function (require, module) {
  'use strict';

  module.exports = function (grunt) {

    // Load modules
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-glue-js');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');

    // Define config
    var config = {};

    var paths = {
      allJs: ['*.js', 'libs/**/*.js', 'example/example.js'],
      browserifySrc: ['index.js'],
      browserifyDest: 'dist/<%= pkg.name %>.js',
      uglifyDest: 'dist/<%= pkg.name %>.min.js',
    };

    config.jsbeautifier = {
      all: paths.allJs,
      options: {
        config: '.jsbeautifyrc'
      }
    };

    config.jshint = {
      reporter: require('jshint-stylish'),
      all: paths.allJs,
      options: {
        jshintrc: true
      }
    };

    config.browserify = {
      options: {
        browserifyOptions: {
          standalone: 'MoussakaClient'
        }
      }
    };
    config.browserify[paths.browserifyDest] =
      paths.browserifySrc;

    config.uglify = {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      moussaka_client: {
        files: {} // See below
      }
    };

    config.uglify.moussaka_client
      .files[paths.uglifyDest] = [paths.browserifyDest];

    // Read in package.json for templating
    config.pkg = grunt.file.readJSON('package.json');

    // Init grunt
    grunt.initConfig(config);

    // Define tasks
    grunt.registerTask('lint', ['jshint:all', 'jsbeautifier:all']);
    grunt.registerTask('compile', ['lint', 'browserify', 'uglify']);
    grunt.registerTask('default', ['compile']);
  };

})(require, module);
