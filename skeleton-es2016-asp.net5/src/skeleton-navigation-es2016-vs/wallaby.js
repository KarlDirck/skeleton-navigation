/* eslint-disable no-var, no-shadow, dot-notation */

var babel = require('babel');

module.exports = function(wallaby) {
  return {
    files: [

      {pattern: 'wwwroot/jspm_packages/system.js', instrument: false},
      {pattern: 'wwwroot/config.js', instrument: false},

      {pattern: 'src/**/*.js', load: false}

    ],

    tests: [
      {pattern: 'test/unit/**/*.spec.js', load: false}
    ],

    compilers: {
      '**/*.js': wallaby.compilers.babel({
        babel: babel,
        optional: [
          'es7.decorators',
          'es7.classProperties'
        ]
      })
    },

    middleware: (app, express) => {
      app.use('/wwwroot/jspm_packages', express.static(require('path').join(__dirname, 'wwwroot', 'jspm_packages')));
      app.use('/jspm_packages', express.static(require('path').join(__dirname, 'wwwroot', 'jspm_packages')));
    },

    bootstrap: function(wallaby) {
      var promises = [];
      var i = 0;
      var len = wallaby.tests.length;

      wallaby.delayStart();

      System.config({
        paths: {
          '*': '*'
        }
      });
      for (; i < len; i++) {
        promises.push(System['import'](wallaby.tests[i].replace(/\.js$/, '')));
      }

      Promise.all(promises).then(function() {
        wallaby.start();
      }).catch(function (e) { setTimeout(function (){ throw e; }, 0); });
    },

    debug: false
  };
};
