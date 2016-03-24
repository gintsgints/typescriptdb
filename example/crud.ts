import "reflect-metadata";
import {Item} from './item';
import {Driver} from '../drivers/sqlite';

// Before we initiate model we need driver
var driver = new Driver();

// Let's create object
var test = new Item(driver);
test.Partno = "234";
test.Instock = 2;
test.Save();
