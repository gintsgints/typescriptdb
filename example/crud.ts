import "reflect-metadata";
import {Item} from './item';
import {Driver} from '../drivers/sqlite';

var driver = new Driver();

var test = new Item(driver);
test.Partno = "234";
test.Save();

console.log('Test object:');
console.log(test);
console.log(test.driver);
console.log('Metadata caption for field Partno:', Reflect.getMetadata('caption', test, 'Partno'));
console.log('Metadata caption for field Instock:', Reflect.getMetadata('caption', test, 'Instock'));
