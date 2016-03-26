import {Migration, MigrationBase} from '../../index';
import {Item} from '../item';
import {Driver} from '../../drivers/sqlite';

class CreateTable extends Migration implements MigrationBase {
    Up() {
        this.CreateTable();
    }
    Down() {
        this.DropTable();    
    }
}

var driver = new Driver();
var item = new Item(driver);
export var migration = new CreateTable(item);
