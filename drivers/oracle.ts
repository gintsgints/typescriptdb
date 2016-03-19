import {Database} from "sqlite3";
import {MigrationBase, Model} from '../index';

module Driver {
    export class Migration extends MigrationBase {
        CreateTable(Model) {
            console.log('Creating oracle table');
        };
        DropTable(string) {
            console.log('Dropping oracle table');       
        };
    }
}