import {Database} from "sqlite3";
import {MigrationBase, ModelBase, Field, FIELD_TYPE} from '../index';

var settings = require('../../settings.' + process.env.NODE_ENV + '.json');

export class Model {
    modelBase: ModelBase;
    
    constructor(model: ModelBase) {
        this.modelBase = model;  
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
        return field.name + ' ' + Model.prototype.SQLType(field.type);
    }

    SQLFields(): string {
        var result: string = '';
        this.modelBase.fields.forEach(function (field) {
            result = result + Model.prototype.SQLField(field) + ', ';
        })
        return result.substring(0, result.length - 2);
    }
}
