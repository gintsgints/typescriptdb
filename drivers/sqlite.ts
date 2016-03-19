import {Database} from "sqlite3";
import {MigrationBase, Model, Field, FIELD_TYPE} from '../index';

var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

class SQLLiteModel {
    model: Model;
    
    constructor(model: Model) {
        this.model = model;  
    }
    
    SQLType(type: FIELD_TYPE): string {
        var result: string;
        switch (type) {
            case FIELD_TYPE.string:
                result = 'TEXT';
                break;
            case FIELD_TYPE.number:
                result = 'INTEGER';
                break;
            case FIELD_TYPE.datetime:
                result = 'INTEGER';
                break;
            case FIELD_TYPE.text:
                result = 'TEXT';
                break;
            default:
                result = 'undefined';
        }
        return result;
    }
    
    SQLField(field: Field): string {
        return field.name + ' ' + SQLLiteModel.prototype.SQLType(field.type);
    }

    SQLFields(): string {
        var result: string = '';
        this.model.fields.forEach(function (field) {
            result = result + SQLLiteModel.prototype.SQLField(field) + ', ';
        })
        return result.substring(0, result.length - 2);
    }
}

export class Migration extends MigrationBase {
    db: Database;
    
    constructor() {
        super();
        this.db = new Database(settings.connection);
    }
    
    CreateTable(model: Model) {
        var sql: string;
        var liteModel = new SQLLiteModel(model);
        console.log();
        sql = "CREATE TABLE " + model.tableName + " (";
        sql = sql + liteModel.SQLFields();
        this.db.run(sql + " )");
    };
    CreateTableIgnore(model: Model) {
        var sql: string;
        var liteModel = new SQLLiteModel(model);
        console.log();
        sql = "CREATE TABLE IF NOT EXISTS " + model.tableName + " (";
        sql = sql + liteModel.SQLFields();
        this.db.run(sql + " )");
    };
    DropTable(model: Model) {
        this.db.run("DROP TABLE " + model.tableName);
    };
}
