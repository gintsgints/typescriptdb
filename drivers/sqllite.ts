import {Database} from "sqlite3";
import {MigrationBase, Model} from '../index';

var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

export class Migration extends MigrationBase {
    db: Database;
    
    constructor() {
        super();
        this.db = new Database(settings.connection);
    }
    
    CreateTable(model: Model) {
        this.db.run("CREATE TABLE " + model.tableName + " (info TEXT)");
    };
    DropTable(model: Model) {
        this.db.run("DROP TABLE " + model.tableName);
    };
}
