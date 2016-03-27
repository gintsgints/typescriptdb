import {Database} from "sqlite3";
import {DriverInterface, DriverBase, Model} from "../index"

var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

export const DRIVER_STRINGTERM = '"';

export class Driver extends DriverBase implements DriverInterface {
    db: Database;
    verbose: boolean = false;

    // Management functions
    constructor(options?: Object) {
        super();
        this.db = new Database(settings.connection);
        if (!!options) {
            if (options['verbose']) {
                this.verbose = true;
            }
        }
    }
    
    Enclose(obj: Model, field, value): string {
        if (typeof obj[field] === 'string') {
            return DRIVER_STRINGTERM + value + DRIVER_STRINGTERM;
        } else {
            return value;
        }
    }
        
    // Object like functions
    Find(obj: Model, callback: Function) {
        var pks = obj.getPrimaryKeys();
        if (this.verbose) { console.log("Primary keys:", pks); };  
        if (pks.length > 0) {
            var sql = "select " + obj.getFields().join(", ") + " FROM ";
            sql += obj.getTableName();
            console.log('SQL: ', sql);
            this.db.get(sql, callback);
        } else {
            callback('Primary key is not defined', null);
        }
    }
    
    Save(obj: Model, callback: Function):void {
        console.log("Saving object... what data we have about it:");
        var fields = obj.getFields();
        console.log('Fields:', fields);
        console.log('Primary Keys:', obj.getPrimaryKeys());
        console.log('First field proprties:', obj.getProperties(fields[0]));
    }
    
    // Migration like functions
    CreateTable(model: Model, callback: Function) {
        var sql: string;
        sql = "CREATE TABLE " + model.getTableName() + " (";
        sql = sql + model.getFields().join(',')
        this.db.run(sql + " )", callback);
    };
    CreateTableIgnore(model: Model, callback: Function) {
        var sql: string;
        console.log();
        sql = "CREATE TABLE IF NOT EXISTS " + model.getTableName() + " (";
        sql = sql + model.getFields().join(',')
        this.db.run(sql + " )", callback);
    };
    
    InsertRecord(model: Model, callback: Function) {
        var sql: string;
        var values = model.getValues();
        var fields = [];
        var fieldvalues = [];
        var myself = this;
        Object.keys(values).forEach(function (key) {
            fields.push(key);
            fieldvalues.push(myself.Enclose(model, key, values[key]));
        })
        sql = 'insert into ' + model.getTableName() + ' (' + fields.join(',') + ') ';
        sql += 'values (' + fieldvalues.join(',') + ')';
        console.log("SQL:", sql);
        this.db.run(sql, callback);
    };
    
    DropTable(tablename: string, callback: Function) {
        this.db.run('DROP TABLE ' + tablename, callback);
    }
    
}