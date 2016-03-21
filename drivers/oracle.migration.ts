import {Database} from "sqlite3";
import {MigrationBase, ModelBase} from '../index';

module Driver {
    export class MigrationImpl extends MigrationBase {
        CreateTable(ModelBase) {
            console.log('Creating oracle table');
        };
        DropTable(string) {
            console.log('Dropping oracle table');       
        };
    }
}