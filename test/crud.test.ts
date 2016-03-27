var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
import {Model, Table, Field} from '../index';
import {Driver} from '../drivers/sqlite';

@Table('item_table_name')
class Item extends Model {
    @Field({pk: true, caption: "Part No."})
    Partno: number;
    
    @Field({ caption: "In Stock", size: 2 })
    Instock: number = 0;

    @Field({})
    Name: string;
}
var driver = new Driver();    
var record = new Item(driver);

describe('CRUD operations with objects', function() {
    beforeEach(function(done) {
        record.driver.DropTable('item_table_name', function(err, result) {
            record.driver.CreateTable(record, function(err, result) {
                if (!err) {
                    record.Partno = 1;
                    record.Name = 'Part number 1';
                    record.driver.InsertRecord(record, function(err, result) {
                        done();
                    });
                } else {
                    throw err;
                }    
            });
        });
    })
    describe('Query operations', function() {
        it('Find should get record by ID', function(done) {
            record.Partno = 1;
            record.Find(function(err, result) {
                // Expect expected
                done();
            });
        });
    });
    describe('Write operations', function() {
        it('When save record, and not found by primary key, it should be created', function() {

            record.Partno = 1;
            record.Name = 'Part number 1';
            record.Save(function(err, result) {
                
            });
        })
    })
});