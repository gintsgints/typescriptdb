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
// var driver = new Driver({verbose: true});    
var driver = new Driver();    
var record = new Item(driver);

describe('CRUD operations with objects', function() {
    beforeEach(function(done) {
        record.driver.DropTable('item_table_name', function(err, result) {
            record.driver.CreateTable(record, function(err, result) {
                if (!err) {
                    record.Partno = 1;
                    record.Name = 'Part number 1';
                    record.driver.Insert(record, function(err, result) {
                        if (!err) {
                            done();    
                        } else {
                            throw err;
                        }
                        
                    });
                } else {
                    throw err;
                }    
            });
        });
    })
    describe('Query operations', function() {
        it('Find should get record by ID', function(done) {
            var findrecord = new Item(driver);
            findrecord.Partno = 1;
            findrecord.Find(function(err, result) {
                expect(err).to.be.null;
                expect(findrecord.Name).to.be.equal('Part number 1');
                done();
            });
        });
    });
    describe('Query operations', function() {
        it('Find should get exact record by ID', function(done) {
            var findrecord = new Item(driver);
            findrecord.Partno = 2;
            findrecord.Find(function(err, result) {
                expect(err).to.be.null;
                expect(result).to.be.null;
                done();
            });
        });
    });
    describe('Write operations', function() {
        it('When save record, and not found by primary key, it should be created', function(done) {
            record.Partno = 2;
            record.Name = 'Part number 2';
            record.Save(function(err, result) {
                expect(err).to.be.null;
                var check = new Item(driver);
                check.Partno = 2;
                check.Find(function(err, result) {
                    expect(check.Name).to.be.equal('Part number 2');
                    done();
                });
            });
        })
    })
});
