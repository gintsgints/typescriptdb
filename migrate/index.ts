var fs = require('fs');
var path = require('path');

var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

// Thanks for code - http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
// Looping trough transformations directory from settings and search for .transformation files.
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          var parsed = path.parse(file);
          if (parsed.name.indexOf('.transformation') > -1) {
              results.push(file);
          }    
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk(settings.transformations, function(err, results) {
  if (err) throw err;
  domigrate(results); // <--- migration itself (see below)
});
// End of looping trough all files for .transformation

function domigrate(paths: Array<string>) {
    paths.forEach(function(file) {
        migrate(file);
    });
}

function migrate(file: string) {
    var migrationModule = require(file);
    var migr = new migrationModule.MigrationModule.Migrate();
    if (process.argv[2] === 'down') {
        migr.Down();
    } else {
        migr.Up();
    }
    console.log('Migration - ' + file + ' OK');
}