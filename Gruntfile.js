// Main entry point
(function (require, module) {
  'use strict';

  module.exports = function (grunt) {

    // Load modules
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-glue-js');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Define config
    var config = {};

    var paths = {
      allJs: ['*.js', 'libs/**/*.js'],
      glueSrc: ['index.js', 'libs/**/*.js', 'node_modules/sprintf-js/'],
      glueDest: 'dist/<%= pkg.name %>.js',
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

    config.gluejs = {
      moussaka_client: {
        options: {
          export: 'moussaka',
          main: 'index.js',
        },
        src: paths.glueSrc,
        dest: paths.glueDest
      }
    };

    config.uglify = {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      moussaka_client: {
        files: {}
      }
    };

    config.uglify.moussaka_client
      .files[paths.uglifyDest] = [paths.glueDest];

    // Read in package.json for templating
    config.pkg = grunt.file.readJSON('package.json');

    // Init grunt
    grunt.initConfig(config);

    // Define tasks
    grunt.registerTask('lint', ['jshint:all', 'jsbeautifier:all']);
    grunt.registerTask('compile', ['lint', 'gluejs', 'uglify']);
    grunt.registerTask('default', ['compile']);
  };

})(require, module);
