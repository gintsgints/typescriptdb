import "reflect-metadata";

var settings = require('../settings.' + process.env.NODE_ENV + '.json');

// Metata constants applied to field property by decorators
// after that they used to identify different aspects of field against database
// This information is used by driver
const META_FIELD = 'field';
const META_PK = 'pk';
const META_CAPTION = 'caption';
const META_SIZE = 'size';
const META_DECIMAL = 'decimal';
const META_NULLABLE = 'nullable';
const META_INDEX = 'index';

// Table decorator
export function Table(table_name: string) {
    return function (target: any) {

        let newConstructor = function (driver: DriverInterface) {
            this.table_name = table_name;
            this.driver = driver;
        };

        newConstructor.prototype = Object.create(target.prototype);
        return <any> newConstructor;
    }
}

// All possible information you can put as field decorator info
export interface FieldMetaData {
    pk?: boolean;
    caption?: string;
    size?: number;
    decimal?: number;
    nullable?: boolean;
    index?: boolean;
}

// Field decorator itself
export function Field(metadata: FieldMetaData): PropertyDecorator {
    return function (target: Object, name: string) {
        Reflect.defineMetadata("field_" + name, true, target); // We store field name as table metadata
        Reflect.defineMetadata(META_PK, metadata.pk, target, name);
        Reflect.defineMetadata(META_CAPTION, metadata.caption, target, name);
        Reflect.defineMetadata(META_SIZE, metadata.size, target, name);
        Reflect.defineMetadata(META_DECIMAL, metadata.decimal, target, name);
        Reflect.defineMetadata(META_NULLABLE, metadata.nullable, target, name);
        Reflect.defineMetadata(META_INDEX, metadata.index, target, name);
    }
}

// Base for all aiviable drivers.
// Implement framework specific functionality, like metadata interpretation.
export class DriverBase {
    getFieldsWithMeta(obj: Model, metadataKey: string): Array<string> {
        var result = [];
        var key: string = "";
        var keys = Reflect.getMetadataKeys(obj);
        keys.forEach(function(key: string) {
            key = key.slice(key.indexOf('field_') + 6);
            if (Reflect.getMetadata(metadataKey, obj, key)) {
                result.push(key);
            }
        });

        return result;
    }
    
    getFields(obj: Model): Array<string> {
        return this.getFieldsWithMeta(obj, META_FIELD);
    }
    
    getPrimaryKeys(obj: Model): Array<string> {
        return this.getFieldsWithMeta(obj, META_PK);
    }
    
    getProperties(obj: Model, field: string): Array<string> {
        return Reflect.getMetadataKeys(obj, field);
    }
}

// Interface for implementing drivers. All functions which need to implement is here.
export interface DriverInterface {
    Save(obj:Model):void;
    Find(obj:Model, id:string, callback:Function);   
}

// Using driver you can  define database model
export class Model {
    driver: DriverInterface;
    table_name: string;
    
    constructor(driver: DriverInterface) {
        this.driver = driver;    
    }
    
    Find(id: string, callback: Function) {
        this.driver.Find(this, id, function(err, row) {
            // Transform row back to object
            callback(err, row);
        });
    }
    
    Save(): void {
        this.driver.Save(this);
    }
}

// // --- Migration definitions
// export class MigrationBase {
//     Up() {
        
//     };
//     Down() {
        
//     };
// }

// export var Migration = require('./drivers/' + settings.driver + '.migration').MigrationImpl;
// export var Model = require('./drivers/' + settings.driver + '.model').Model;
