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
    
    GetType(field: any): string {
        if (typeof field === 'string') {
            return 'TEXT'
        }
        if (typeof field === 'number') {
            return 'REAL'
        }
        return null;
    }
    
    Enclose(field: any): string {
        if (typeof field === 'string') {
            return DRIVER_STRINGTERM + field + DRIVER_STRINGTERM;
        } else {
            return field.toString();
        }
    }
        
    // Object like functions
    Find(obj: Model, callback: Function) {
        var pks = obj.getPrimaryKeys();
        if (this.verbose) { console.log("Primary keys:", pks); };  
        if (pks.length > 0) {
            var sql = "select " + obj.getFields().join(", ") + " FROM ";
            sql += obj.getTableName();
            sql += ' where ' + pks[0] + ' = ' + this.Enclose(obj[pks[0]]);
            if (this.verbose) { console.log('SQL: ', sql); }
            this.db.get(sql, function(err, result) {
                if (result) {
                    callback(err, result);    
                } else {
                    callback(err, null);
                }             
            });
        } else {
            callback('Primary key is not defined', null);
        }
    }
    
    First(obj: Model, callback: Function) {
        var sql = "select " + obj.getFields().join(", ") + " from " + obj.getTableName();
        var pks = obj.getPrimaryKeys();
        if (pks.length > 0) {
            sql += " order by " + pks[0];
        }
        sql += " limit 1 ";
        if (this.verbose) {console.log('SQL: ', sql);}
        this.db.get(sql, function(err, result) {
            if (result) {
                callback(err, result);    
            } else {
                callback(err, null);
            }             
        });
    }

    Last(obj: Model, callback: Function) {
        var pks = obj.getPrimaryKeys();
        if (this.verbose) { console.log("Primary keys:", pks); };  
        if (pks.length > 0) {
            var sql = "select " + obj.getFields().join(", ") + " FROM ";
            sql += obj.getTableName();
            sql += ' where ' + pks[0] + ' = (select max(' + pks[0] + ') from ' + obj.getTableName() + ')';
            if (this.verbose) {console.log('SQL: ', sql);}
            this.db.get(sql, function(err, result) {
                if (result) {
                    callback(err, result);    
                } else {
                    callback(err, null);
                }             
            });
        } else {
            callback('Primary key is not defined', null);
        }
    }

    // Data functions    
    Update(model: Model, callback: Function):void {
        var sql: string;
        var values = model.getSQLValues();
        var fields = [];
        var fieldvalues = [];
        sql = 'update ' + model.getTableName() + ' set ';
        Object.keys(values).forEach(function (key) {
            sql += key + '=' + values[key] + ',';
        })
        sql = sql.slice(0, sql.length - 1);

        if (this.verbose) { console.log("SQL:", sql); }
        this.db.run(sql, callback);
    }
    
    Insert(model: Model, callback: Function) {
        var sql: string;
        var values = model.getSQLValues();
        var fields = [];
        var fieldvalues = [];
        Object.keys(values).forEach(function (key) {
            fields.push(key);
            fieldvalues.push(values[key]);
        })
        sql = 'insert into ' + model.getTableName() + ' (' + fields.join(',') + ') ';
        sql += 'values (' + fieldvalues.join(',') + ')';
        if (this.verbose) { console.log("SQL:", sql); }
        this.db.run(sql, callback);
    };
    
    // Model modifications
    CreateTable(model: Model, callback: Function) {
        var sql: string;
        sql = "CREATE TABLE " + model.getTableName() + " (";
        sql = sql + model.getFieldDefs().join(',')
        if (this.verbose) { console.log("SQL:", sql); }
        this.db.run(sql + " )", callback);
    };
    CreateTableIgnore(model: Model, callback: Function) {
        var sql: string;
        console.log();
        sql = "CREATE TABLE IF NOT EXISTS " + model.getTableName() + " (";
        sql = sql + model.getFieldDefs().join(',')
        if (this.verbose) { console.log("SQL:", sql); }
        this.db.run(sql + " )", callback);
    };
    
    DropTable(tablename: string, callback: Function) {
        var sql = 'DROP TABLE ' + tablename;
        if (this.verbose) { console.log("SQL:", sql); }
        this.db.run(sql, callback);
    }
    
}