import {Migration, MigrationBase} from '../../index';
import {Item} from '../item';
import {Driver} from '../../drivers/sqlite';

var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

var driver = new Driver(settings);
var item = new Item(driver);

class CreateTable extends Migration implements MigrationBase {
    Up() {
        this.CreateTable(item);
    }
    Down() {
        this.DropTable(item);
    }
}

export var migration = new CreateTable();
