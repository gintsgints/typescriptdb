import "reflect-metadata";
import {Item} from './item';
import {Driver} from '../drivers/sqlite';

// Before we initiate model we need driver
var driver = new Driver();

// Find existing object (Find works by primary key)
var record = new Item(driver);
record.Find("234", function(err, obj) {
    if (!err) {
        console.log('Record found:');
        console.log(obj);
    } else {
        console.log('Record not found Err: ', err);
        // Let's create object
        var test = new Item(driver);
        test.Partno = "234";
        test.Instock = 2;
        test.Save();
    }
})

// record.Find()
// if (record.Find("234")) {
//     console.log('Record found:');
//     console.log(record);
// } else {
// }

