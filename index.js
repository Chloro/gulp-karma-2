'use strict';

var gutil = require('gulp-util');
var c = gutil.colors;
var es = require('event-stream');
var extend = require('xtend');
var path = require('path');
var spawn = require('child_process').spawn;

var server = require('karma').server;

var karmaPlugin = function(options) {
  var child;
  var stream;
  var files = [];

  options = extend({
    action: 'run'
  }, options);

  var action = options.action;
  delete options.action;

  if (action === 'watch') {
    options.singleRun = false;
    options.autoWatch = true;
  }
  else if (action === 'run') {
    options.singleRun = true;
    options.autoWatch = false;
  }

  if (options.configFile) {
    options.configFile = path.resolve(options.configFile);
  }

  function done(code) {
    if (child) {
      child.kill();
    }
    if (stream) {
      if (code) {
        stream.emit('error', new gutil.PluginError('gulp-karma', 'karma exited with code ' + code));
      }
      else {
        stream.emit('end');
      }
    }
  }

  function startKarmaServer() {
    gutil.log('Starting Karma server...');
    child = spawn(
      'node',
      [
        path.join(__dirname, 'background.js'),
        JSON.stringify(options)
      ],
      {
        stdio: 'inherit'
      }
    );

    child.on('exit', function(code) {
      done(code);
    });
  }

  function queueFile(file) {
    if (file) {
      files.push(file.path);
    }
    else {
      stream.emit('error', new Error('Got undefined file'));
    }
  }

  function endStream() {
    if (files.length) {
      options.files = files;
    }
    startKarmaServer();
  }

  stream = es.through(queueFile, endStream);

  return stream;
};

module.exports = karmaPlugin;
