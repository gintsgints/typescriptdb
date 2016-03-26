import {Database} from "sqlite3";
import {DriverInterface, DriverBase, Model} from "../index"

var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

export class Driver extends DriverBase implements DriverInterface {
    db: Database;

    constructor() {
        super();
        this.db = new Database(settings.connection);
    }
    
    Find(obj: Model, search: string, callback: Function) {
        var pks = obj.getPrimaryKeys();
        console.log("primary keys:", pks);  
        if (pks.length > 0) {
            var sql = "select " + obj.getFields().join(", ") + " FROM ";
            sql += obj.table_name;
            console.log('SQL: ', sql);
            this.db.get(sql, callback);
        } else {
            callback('Primary key is not defined', null);
        }
    }
    
    Save(obj: Model):void {
        console.log("Saving object... what data we have about it:");
        var fields = obj.getFields();
        console.log('Fields:', fields);
        console.log('Primary Keys:', obj.getPrimaryKeys());
        console.log('First field proprties:', obj.getProperties(fields[0]));
    }
    
    CreateTable(model: Model) {
        var sql: string;
        sql = "CREATE TABLE " + model.table_name + " (";
        sql = sql + model.getFields().join(',')
        this.db.run(sql + " )");
    };
    CreateTableIgnore(model: Model) {
        var sql: string;
        console.log();
        sql = "CREATE TABLE IF NOT EXISTS " + model.table_name + " (";
        sql = sql + model.getFields().join(',')
        this.db.run(sql + " )");
    };
    
    DropTable(tablename: string) {
        this.db.run('DROP TABLE ' + tablename);
    }
}