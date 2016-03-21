import "reflect-metadata";
import {Item} from './item';

var test = new Item();
test.Partno = "234";
// //test.Save();

console.log('Test object:');
console.log(test);
console.log('Metadata caption for field Partno:', Reflect.getMetadata('caption', test, 'Partno'));
console.log('Metadata caption for field Instock:', Reflect.getMetadata('caption', test, 'Instock'));
