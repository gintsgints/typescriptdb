import "reflect-metadata";
import {Item} from './item';
import {Driver} from '../drivers/sqlite';

var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

// Before we initiate model we need driver
var driver = new Driver(settings);

// Find existing object (Find works by primary key)
var record = new Item(driver);
record.Partno = 234;
record.Name = "Part number 234 name";
record.Instock = 3;
record.Save().then(function(result) {
    // now let's try find that part.
    var newpart = new Item(driver);
    newpart.Partno = 234;
    return newpart.Find();
}).then(function(result){
    console.log("Part found:", result);
}).catch(function(err) {
    console.log("Error while saving part");
});
