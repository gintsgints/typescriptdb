import {Database} from "sqlite3";
import {DriverInterface, DriverBase, Model} from "../index"

export const DRIVER_STRINGTERM = '"';

export class Driver extends DriverBase implements DriverInterface {
    db: Database;
    verbose: boolean = false;

    // Management functions
    constructor(settings: Object) {
        super();
        this.db = new Database(settings['connection']);
        if (settings['verbose']) {
            this.verbose = true;
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
    Find(obj: Model) {
        return new Promise(function(resolve, reject) {
            var pks = obj.getPrimaryKeys();
            if (this.verbose) { console.log("Primary keys:", pks); };
            if (pks.length > 0) {
                var sql = "select " + obj.getFields().join(", ") + " FROM ";
                sql += obj.getTableName();
                sql += ' where ' + pks[0] + ' = ' + this.Enclose(obj[pks[0]]);
                if (this.verbose) { console.log('SQL: ', sql); }
                this.db.get(sql, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            } else {
                reject('Primary key is not defined');
            }
        });
    }

    First(obj: Model) {
        return new Promise(function(resolve, reject) {
            var sql = "select " + obj.getFields().join(", ") + " from " + obj.getTableName();
            var pks = obj.getPrimaryKeys();
            if (pks.length > 0) {
                sql += " order by " + pks[0];
            }
            sql += " limit 1 ";
            if (this.verbose) { console.log('SQL: ', sql); }
            this.db.get(sql, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    Last(obj: Model) {
        return new Promise(function(resolve, reject) {
            var pks = obj.getPrimaryKeys();
            if (this.verbose) { console.log("Primary keys:", pks); };
            if (pks.length > 0) {
                var sql = "select " + obj.getFields().join(", ") + " FROM ";
                sql += obj.getTableName();
                sql += ' where ' + pks[0] + ' = (select max(' + pks[0] + ') from ' + obj.getTableName() + ')';
                if (this.verbose) { console.log('SQL: ', sql); }
                this.db.get(sql, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            } else {
                reject('Primary key is not defined');
            }
        });
    }

    // Data functions
    Update(model: Model) {
        return new Promise(function(resolve, reject) {
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
            this.db.run(sql, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    Insert(model: Model) {
        return new Promise(function(resolve, reject) {
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
            this.db.run(sql, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    // Model modifications
    CreateTable(model: Model): Promise<any> {
        return new Promise(function(resolve, reject) {
            var sql: string;
            sql = "CREATE TABLE " + model.getTableName() + " (";
            sql = sql + model.getFieldDefs().join(',')
            if (this.verbose) { console.log("SQL:", sql); }
            this.db.run(sql + " )", function(err, result){
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        })
    };

    CreateTableIgnore(model: Model) {
        return new Promise(function(resolve, reject) {
            var sql: string;
            console.log();
            sql = "CREATE TABLE IF NOT EXISTS " + model.getTableName() + " (";
            sql = sql + model.getFieldDefs().join(',')
            if (this.verbose) { console.log("SQL:", sql); }
            this.db.run(sql + " )", function(err, result){
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    };

    DropTable(tablename: string) {
        return new Promise(function(resolve, reject) {
            var sql = 'DROP TABLE ' + tablename;
            if (this.verbose) { console.log("SQL:", sql); }
            this.db.run(sql, function(err, result){
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    };

    AddColumn(model: Model, name: string) {
        return new Promise(function(resolve, reject) {
            var sql = 'ALTER TABLE ' + model.getTableName() + ' ADD COLUMN ';
            sql += model.getFieldDef(name);
            this.db.run(sql, function(err, result){
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

    DropColumn(model: Model, ColumnName: string) {
        return new Promise(function(resolve, reject) {
            var sql = 'CREATE TABLE ' + model.getTableName() + '_table_to_dropcol_ as select * from ' + model.getTableName() + ';'
            var sql = 'ALTER TABLE ' + model.getTableName() + ' DROP COLUMN ';
            sql += ColumnName;
            this.db.run(sql, function(err, result){
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

}