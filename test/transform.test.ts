var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
import {Model, Table, Field} from '../index';

var Driver = require('../drivers/' + process.env.DIALECT).Driver;
var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

@Table('item_table_name')
class Item extends Model {
    @Field({ pk: true, caption: "Part No.", size: 9 })
    Partno: string = "Default";

    @Field({ caption: "In Stock", size: 2 })
    Instock: number = 0;
}

@Table('item_table_name')
class ItemWithCol extends Model {
    @Field({ pk: true, caption: "Part No.", size: 9 })
    Partno: string = "Default";

    @Field({ caption: "In Stock", size: 2 })
    Instock: number = 0;

    @Field({})
    NewField: string;
}

var driver = new Driver(settings);
var record = new Item(driver);
var record2 = new ItemWithCol(driver);

describe('Basic transformations', function () {
    beforeEach(function (done) {
        record.driver.DropTable('item_table_name', function (err, result) {
            done();
        });
    });
    it('Should be able to add column to existing table', function (done) {

        record.driver.CreateTable(record, function (err, result) {
            expect(err).to.be.null;
            record.driver.AddColumn(record2, 'NewField', function (err, result) {
                record2.Partno = 'x';
                record2.NewField = 'New value';
                record2.Save(function (err, result) {
                    expect(err).to.be.null;
                    record2.NewField = '';
                    record2.Find(function (err, result) {
                        expect(err).to.be.null;
                        expect(record2.NewField).to.be.equal('New value');
                        done();
                    })
                })
                done();
            });
        })
    })
})
