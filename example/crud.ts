import "reflect-metadata";
import {Item} from './item';
import {Driver} from '../drivers/sqlite';

// Before we initiate model we need driver
var driver = new Driver();

// Find existing object (Find works by primary key)
var record = new Item(driver);
record.Partno = 234;
record.Name = "Part number 234 name";
record.Instock = 3;
record.Save(function(err, result) {
    if (err) {
        console.log("Error while saving part");
    } else {
        // now let's try find that part.
        var newpart = new Item(driver);
        newpart.Partno = 234;
        newpart.Find(function(err, result) {
            if (err) {
                console.log("Error while find part");
            } else {
                console.log("Part found:", newpart);
            }
        })
    } 
})
