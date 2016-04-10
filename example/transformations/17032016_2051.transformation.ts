import {Migration, MigrationBase} from '../../index';
import {Item} from '../item';
import {Driver} from '../../drivers/sqlite';

var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

class CreateTable extends Migration implements MigrationBase {
    Up() {
        this.CreateTable();
    }
    Down() {
        this.DropTable();    
    }
}

var driver = new Driver(settings);
var item = new Item(driver);
export var migration = new CreateTable(item);
