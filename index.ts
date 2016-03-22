import "reflect-metadata";

var settings = require('../settings.' + process.env.NODE_ENV + '.json');

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

export interface FieldMetaData {
    pk?: boolean;
    caption?: string;
    size?: number;
    decimal?: number;
    nullable?: boolean;
    index?: boolean;
}

export function Field(metadata: FieldMetaData): PropertyDecorator {
    return function (target: Object, name: string) {
        Reflect.defineMetadata('field', true, target, name);
        Reflect.defineMetadata('pk', metadata.pk, target, name);
        Reflect.defineMetadata('caption', metadata.caption, target, name);
        Reflect.defineMetadata('size', metadata.size, target, name);
        Reflect.defineMetadata('decimal', metadata.decimal, target, name);
        Reflect.defineMetadata('nullable', metadata.nullable, target, name);
        Reflect.defineMetadata('index', metadata.index, target, name);
    }
}

export interface DriverInterface {
    Save():void;   
}

export class Model {
    driver: DriverInterface;
    
    constructor(driver: DriverInterface) {
        this.driver = driver;    
    }
    
    Save(): void {
        this.driver.Save();
    }
}

// export interface ModelBase {
//     save();
// }

// // --- Migration definitions
// export class MigrationBase {
//     Up() {
        
//     };
//     Down() {
        
//     };
// }

// export var Migration = require('./drivers/' + settings.driver + '.migration').MigrationImpl;
// export var Model = require('./drivers/' + settings.driver + '.model').Model;
