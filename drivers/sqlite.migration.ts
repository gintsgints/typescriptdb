import {Database} from "sqlite3";
import {MigrationBase, ModelBase, Field, FIELD_TYPE} from '../index';
import {Model} from "./sqlite.model";

var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

export class MigrationImpl extends MigrationBase {
    db: Database;
    
    constructor() {
        super();
        this.db = new Database(settings.connection);
    }
    
    CreateTable(model: ModelBase) {
        var sql: string;
        var liteModel = new Model(model);
        console.log();
        sql = "CREATE TABLE " + model.tableName + " (";
        sql = sql + liteModel.SQLFields();
        this.db.run(sql + " )");
    };
    CreateTableIgnore(model: ModelBase) {
        var sql: string;
        var liteModel = new Model(model);
        console.log();
        sql = "CREATE TABLE IF NOT EXISTS " + model.tableName + " (";
        sql = sql + liteModel.SQLFields();
        this.db.run(sql + " )");
    };
    DropTable(model: ModelBase) {
        this.db.run("DROP TABLE " + model.tableName);
    };
}
