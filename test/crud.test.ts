var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
import {Model, Table, Field} from '../index';
import {Driver} from '../drivers/sqlite';

@Table('item_table_name')
class Item extends Model {
    @Field({pk: true, caption: "Part No."})
    Partno: number;
    
    @Field({})
    Name: string;
}
var driver = new Driver();    
var record = new Item(driver);

beforeEach(function() {
    record.driver.DropTable('item_table_name');
    record.driver.CreateTable(record);
})

describe('CRUD operations with objects', function() {
    describe('Query operations', function() {
        it('Find should get record by ID', function() {
                
        });
    });
    describe('Write operations', function() {
        it('When save record, and not found by primary key, it should be created', function() {

            record.Partno = 1;
            record.Name = 'Part number 1';
            record.Save();
        })
    })
});