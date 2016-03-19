import {Migration} from '../../drivers/sqllite';
import {item} from '../item';

export module MigrationModule {
    export class Migrate extends Migration {
        Up() {
            this.CreateTable(item);    
        }
        Down() {
            this.DropTable(item);
        }    
    }
}