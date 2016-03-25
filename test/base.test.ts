var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
import {Model, Table, Field} from '../index';
import {Driver} from '../drivers/sqlite';

describe('Base object functionality', function() {
    it('Property metadata should be aiviable without property itself', function() {
        @Table('item_table_name')
        class Item extends Model {
            @Field({ pk: true, caption: "Part No.", size: 9 })
            Partno: string = "Default";
            
            @Field({ caption: "In Stock", size: 2 })
            Instock: number = 0;
        }
        var driver = new Driver();    
        var record = new Item(driver);
        var pkcount = driver.getPrimaryKeys(record);
        
        expect(pkcount.length).to.equal(1);
    })
})

// describe('CartSummary', function() {
//   it('getSubtotal() should return 0 if no items are passed in', function() {
//     var cartSummary = new CartSummary([]);
//     expect(cartSummary.getSubtotal()).to.equal(0);
//   });
// });
