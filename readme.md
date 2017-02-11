** Gulp Karma 2
===================

> An easy way to run single single specs off of a gulp watcher.


## Requirements

* `Karma 0.1.4` or newer


## Note

This plugin is nice for running 1 spec file, or a handful of spec files. It allows you to easily pass in the files you
need without having to define a separate karma.conf file. Useful for running tests after a watched file changes on the
dev server, as it can easily run the corresponding spec for the modified file. It's a nice feature when you are doing
your unit testing.

## Example Usage

```javascript
var gulpKarma2 = require('gulp-karma-2');

gulp.watch('app/**/*.specs.js', function(file) {
  console.log('Change detected in file: ' + file.path + ' running it\'s tests...');
  // Put the path to libraries needed to run your tests here:
  var files = ['node_modules/angular/angular.js', 'node_modules/angular-mocks/angular-mocks.js']
  files.push(file.path);
  gulp.src(files)
    .pipe(gulpKarma2({configFile: 'app/karma.conf.js'}))
    .on('error', function(error) {
      console.log(error.message);
    });
});
```
