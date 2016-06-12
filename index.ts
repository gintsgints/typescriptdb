import "reflect-metadata";

var settings = require('../settings.' + process.env.NODE_ENV + '.json');

// Metata constants applied to field property by decorators
// after that they used to identify different aspects of field against database
// This information is used by driver
const META_TABLENAME = 'table_name';
const META_FIELD_PREF = 'field_';
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
        Reflect.defineMetadata(META_FIELD_PREF + name, true, target); // We store field name as table metadata
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
    GetType(field: any): string;
    Enclose(field: any): string;
    Find(obj:Model): Promise<any>;
    Insert(obj:Model): Promise<any>;
    Update(obj:Model): Promise<any>;
    First(obj:Model): Promise<any>;
    Last(obj:Model): Promise<any>;
    CreateTable(model: Model): Promise<any>;
    CreateTableIgnore(model: Model): Promise<any>;
    DropTable(table_name: string): Promise<any>;
    AddColumn(model: Model, name: string): Promise<any>;
}

// Using driver you can  define database model
export class Model {
    driver: DriverInterface;
    table_name: string;

    constructor(driver: DriverInterface) {
        this.driver = driver;
    }

    // Helper functions
    assignData(result: Object):void {
        var myself = this;
        Object.keys(result).forEach(function(key: string) {
            myself[key] = result[key];
        });
    }

    // Metadata helper functions
    getTableName(): string {
        return Reflect.getMetadata(META_TABLENAME, this); 
    }

    getFieldsWithMeta(metadataKey: string): Array<string> {
        var result = [];
        var key: string = "";
        var keys = Reflect.getMetadataKeys(this);
        var obj = this;
        keys.forEach(function(key: string) {
            key = key.slice(key.indexOf(META_FIELD_PREF) + 6);
            if (Reflect.getMetadata(metadataKey, obj, key)) {
                result.push(key);
            }
        });

        return result;
    }

    // Get's array of all defined field names
    getFields(): Array<string> {
        var result = [];
        var key: string = "";
        var keys = Reflect.getMetadataKeys(this);
        keys.forEach(function(key: string) {
            if (key.indexOf(META_FIELD_PREF) !== -1) {
                key = key.slice(key.indexOf(META_FIELD_PREF) + 6);
                result.push(key);
            }
        });

        return result;
    }

    // Get's array of all field definitions (for CreateTable)
    getFieldDefs(): Array<string> {
        var result = [];
        var fields = this.getFields();
        var myself = this;
        fields.forEach(function(field) {
            result.push(field + " " + myself.driver.GetType(myself[field]));
        })
        return result;
    }

    // Get's array of all field definitions (for CreateTable)
    getFieldDef(name: string): string {
        return name + " " + this.driver.GetType(this[name]);
    }

    // Return object with all field/value pairs
    getValues(): Object {
        var result = {};
        var fields = this.getFields();
        var myself = this;
        fields.forEach(function(field) {
            if (myself[field] !== undefined) {
                result[field] = myself[field];
            }
        })
        return result;
    }

    // Return object with all field/value pairs where values are ready for SQL
    getSQLValues(): Object {
        var result = {};
        var fields = this.getFields();
        var myself = this;
        fields.forEach(function(field) {
            if (myself[field] !== undefined) {
                result[field] = myself.driver.Enclose(myself[field]);
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

    // Data manipulation
    Find(): Promise<any> {
        return this.driver.Find(this).then(function(result) {
            return this.assignData(result);
        });
    }

    First(): Promise<any> {
        return this.driver.First(this).then(function(result) {
            return this.assignData(result);
        });
    }

    Last(): Promise<any> {
        return this.driver.Last(this).then(function(result) {
            return this.assignData(result);
        });
    }

    Save(): Promise<any> {
        return new Promise(function(resolve, reject) {
            var pk = this.getPrimaryKeys();
            if (this[pk[0]]) {
                return this.Find().then(function(result) {
                    if (result) {
                        return this.driver.Update(this);
                    } else {
                        return this.driver.Insert(this);
                    }
                });
            } else {
                reject("No primary key provided");
            }

        });
    }
}

export interface MigrationBase {
    Up();
    Down();
}

// --- Migration definitions
export class Migration {
    Insert(model: Model): Promise<any> {
        return model.driver.Insert(model);
    }

    CreateTable(model: Model): Promise<any> {
        return model.driver.CreateTable(model);
    }

    DropTable(model: Model): Promise<any> {
        return model.driver.DropTable(model.getTableName());
    }

    AddColumn(model: Model, name: string): Promise<any> {
        return model.driver.AddColumn(model, name);
    }
}
