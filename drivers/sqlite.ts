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
        var pks = this.getPrimaryKeys(obj);
        console.log("primary keys:", pks);  
        if (pks.length > 0) {
            var sql = "select " + this.getFields(obj).join(", ") + " FROM ";
            sql += obj.table_name;
            this.db.get(sql, callback);
        } else {
            callback('Primary key is not defined', null);
        }
    }
    
    Save(obj: Model):void {
        console.log("Saving object... what data we have about it:");
        var fields = this.getFields(obj);
        console.log('Fields:', fields);
        console.log('Primary Keys:', this.getPrimaryKeys(obj));
        console.log('First field proprties:', this.getProperties(obj, fields[0]));
    }
}