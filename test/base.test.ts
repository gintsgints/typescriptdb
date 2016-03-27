var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
import {Model, Table, Field} from '../index';
import {Driver} from '../drivers/sqlite';

@Table('item_table_name')
class Item extends Model {
    @Field({ pk: true, caption: "Part No.", size: 9 })
    Partno: string = "Default";
    
    @Field({ caption: "In Stock", size: 2 })
    Instock: number = 0;
    
    @Field({ caption: "Field without value", size:1})
    Test: string;
}

describe('Base object functionality', function() {
    // it('Driver should allow to pass options while creation', function() {
    //     expect(new Driver({verbose: true})).to.not.throw('good function');
    // })
    it('Field decorator should assign metadata to field variable', function() {
        var driver = new Driver();    
        var record = new Item(driver);

        var test = Reflect.getMetadata("caption", record, "Partno");
        
        expect(test).to.equal('Part No.');
    })
    it('Property metadata should allow to get all fields, (even without value)', function() {
        var driver = new Driver();    
        var record = new Item(driver);
        var fields = record.getFields();
        
        expect(fields.length).to.equal(3);
        expect(fields[0]).to.equal('Partno');
    })
    it('getValues function should return default values and values assigned', function() {
        var driver = new Driver();    
        var record = new Item(driver);
        var values = record.getValues();
        
        expect(values.length).to.equal(2);
        expect(values[0]['Partno']).to.equal('Default');

        record.Test = "Assigned value";
        values = record.getValues();
        expect(values.length).to.equal(3);
    })
    it('Property metadata should be aiviable without property itself', function() {
        var driver = new Driver();    
        var record = new Item(driver);
        var pkcount = record.getPrimaryKeys();
        
        expect(pkcount.length).to.equal(1);
    })
})
