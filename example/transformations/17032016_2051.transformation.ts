import {Migration, MigrationBase} from '../../index';
import {Item} from '../item';

export class CreateTable extends Migration implements MigrationBase {
    Up() {
        this.CreateTable();
    }
    Down() {
        this.DropTable();    
    }
}
