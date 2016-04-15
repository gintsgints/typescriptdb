var fs = require('fs');
var path = require('path');
import {SchemaVersion} from './schema_version';

var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

// Thanks for code - http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
// Looping trough transformations directory from settings and search for .transformation files.
var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
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

walk(settings.transformations, function (err, results) {
    if (err) throw err;
    domigrate(results); // <--- migration itself (see below)
});
// End of looping trough all files for .transformation

function domigrate(paths: Array<string>) {
    // Apply migrations
    paths.forEach(function (file) {
        migrate(file);
    });
}

function migrate(file: string) {
    // Require migration
    var migr = require(file).migration;
    // Schema versions table
    var ver = new SchemaVersion(migr.model.driver);

    // Prepeare callback for migration
    var callback = function (err, result) {
        if (err) {
            fail(file, err);
        } else {
            ver.state = 'ok'
            ver.Save(function (err, result) {
                if (err) {
                    console.log('saving... version')
                    fail(file, err);
                } else {
                    success(file);
                }
            })
        };
    }

    // Then we do migration itself
    migr.SetCallback(callback);

    ver.Last(function (err, result) {
        if (err) {
            fail(file, err);
        } else {
            if (ver.version === null) {
                console.log("null result")
            }
            console.log('Last version record for: ', ver.version);
            if (process.argv[2] === 'down') {
                migr.Down();
            } else {
                var newver = extractVersion(file);
                if (newver > ver.version) {
                    console.log('Upgrading from:', ver.version, ' to:', newver);
                    ver.version = newver;
                    ver.desc = file;
                    migr.Up();
                }
            }
        }
    });
}

function extractVersion(file): string {
    var result;
    result = path.basename(file);
    result = result.slice(0, result.indexOf('.transformation.js'))
    return result;
}

function fail(file, err) {
    console.log('Migration - ', file, ' Failed!');
    console.log('Error:', err);
}

function success(file) {
    console.log('Migration - ' + file + ' OK');
}