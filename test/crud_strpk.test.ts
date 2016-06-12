var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
import {Model, Table, Field} from '../index';

var Driver = require('../drivers/' + process.env.DIALECT).Driver;
var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

@Table('item_table_name')
class Item extends Model {
    @Field({ pk: true, caption: "Part No." })
    Partno: string;

    @Field({ caption: "In Stock", size: 2 })
    Instock: number = 0;

    @Field({})
    Name: string;
}
// var driver = new Driver({verbose: true});
var driver = new Driver(settings);
var record = new Item(driver);

describe('CRUD operations with objects with string PK', function () {
    beforeEach(function(done) {
        record.driver.DropTable('item_table_name')
            .then(function(result) {
                return record.driver.CreateTable(record);
            }).then(function(result) {
                record.Partno = '1'
                record.Name = 'Part number 1'
                return record.driver.Insert(record)
            }).then(function(result) {
                record.Partno = '2'
                record.Name = 'Part number 2'
                return record.driver.Insert(record)
            }).then(function(result) {
                record.Partno = '3'
                record.Name = 'Part number 3'
                return record.driver.Insert(record)
            }).then(function(result) {
                done();
            }).catch(function(err) {
                throw err;
            })
    })

    describe('Query operations', function () {
        it('Find should get record by ID', function (done) {
            var findrecord = new Item(driver);
            findrecord.Partno = '1';
            findrecord.Find().then(function (result) {
                expect(findrecord.Name).to.be.equal('Part number 1');
                done();
            }).catch(function(err) {
                expect(err).to.be.null;
                done();
            })
        });
        it('Find should return null if no record exists by ID', function (done) {
            var findrecord = new Item(driver);
            findrecord.Partno = '4';
            findrecord.Find().then(function (result) {
                expect(result).to.be.null;
                done();
            }).catch(function(err) {
                expect(err).to.be.null;
                done();
            })
        });
        it('First should get first record ordered against primary key', function (done) {
            var findrecord = new Item(driver);
            findrecord.First().then(function (result) {
                expect(findrecord.Name).to.be.equal('Part number 1');
                done();
            }).catch(function(err) {
                expect(err).to.be.null;
                done();
            })
        });
        it('Last should get last record ordered against primary key', function (done) {
            var findrecord = new Item(driver);
            findrecord.Last().then(function (result) {
                expect(findrecord.Name).to.be.equal('Part number 3');
                done();
            }).catch(function(err) {
                expect(err).to.be.null;
                done();
            })
        });
    });
    describe('Write operations', function () {
        it('When save record, and not found by primary key, it should be created', function (done) {
            record.Partno = '4';
            record.Name = 'Part number 4';
            record.Save().then(function (result) {
                var check = new Item(driver);
                check.Partno = '4';
                return check.Find();
            }).then(function(result) {
                expect(result.Name).to.be.equal('Part number 4');
                done();
            }).catch(function(err) {
                expect(err).to.be.null;
                done();
            })
        })
    })
});
