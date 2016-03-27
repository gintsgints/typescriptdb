import "reflect-metadata";

var settings = require('../settings.' + process.env.NODE_ENV + '.json');

// Metata constants applied to field property by decorators
// after that they used to identify different aspects of field against database
// This information is used by driver
const META_TABLENAME = 'table_name';
const META_FIELD = 'field';
const META_PK = 'pk';
const META_CAPTION = 'caption';
const META_SIZE = 'size';
const META_DECIMAL = 'decimal';
const META_NULLABLE = 'nullable';
const META_INDEX = 'index';

// Table decorator
export function Table(tableName: string) {
    return function(
        target: Function // The class the decorator is declared on
        ) {
        Reflect.defineMetadata(META_TABLENAME, tableName, target.prototype);
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
}

// Interface for implementing drivers. All functions which need to implement is here.
export interface DriverInterface {
    CreateTable(model: Model, callback: Function):void;    
    DropTable(table_name: string, callback: Function): void;
    Find(obj:Model, callback: Function);
    Save(obj:Model, callback: Function):void;
}

// Using driver you can  define database model
export class Model {
    driver: DriverInterface;
    table_name: string;
    
    constructor(driver: DriverInterface) {
        this.driver = driver;    
    }
    
    getTableName(): string {
        return Reflect.getMetadata(META_TABLENAME, this); 
    }
    
    getFieldsWithMeta(metadataKey: string): Array<string> {
        var result = [];
        var key: string = "";
        var keys = Reflect.getMetadataKeys(this);
        var obj = this;
        keys.forEach(function(key: string) {
            key = key.slice(key.indexOf('field_') + 6);
            if (Reflect.getMetadata(metadataKey, obj, key)) {
                result.push(key);
            }
        });

        return result;
    }
    
    getFields(): Array<string> {
        var result = [];
        var key: string = "";
        var keys = Reflect.getMetadataKeys(this);
        keys.forEach(function(key: string) {
            if (key.indexOf('field_') !== -1) {
                key = key.slice(key.indexOf('field_') + 6); 
                result.push(key);   
            }
        });

        return result;
    }
    
    getValues(): Array<Object> {
        var result = [];
        var fields = this.getFields();
        var myself = this;
        fields.forEach(function(field) {
            if (myself[field] !== undefined) {
                var rec = {};
                rec[field] = myself[field];
                result.push(rec);
            }
        })
        return result;
    }
    
    getPrimaryKeys(): Array<string> {
        return this.getFieldsWithMeta(META_PK);
    }
    
    getProperties(field: string): Array<string> {
        return Reflect.getMetadataKeys(this, field);
    }

    Find(callback: Function) {
        this.driver.Find(this, function(err, row) {
            // Transform row back to object
            console.log("Find result:", err, row);
        });
    }
    
    Save(): void {
        this.driver.Save(this, function(err, row) {
            // Transform row back to object
            console.log("Save result:", err, row);
        });
    }
}

export interface MigrationBase {
    Up();
    Down();
}

// --- Migration definitions
export class Migration {
    model: Model;
    callback: Function;

    constructor(model: Model) {
        this.model = model;    
    }
        
    CreateTable() {
        this.model.driver.CreateTable(this.model, this.callback);    
    }
    
    DropTable() {
        this.model.driver.DropTable(this.model.getTableName(), this.callback);
    }
    
    SetCallback(callback: Function) {
        this.callback = callback;
    }
}
