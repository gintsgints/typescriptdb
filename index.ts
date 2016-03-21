import "reflect-metadata";

var settings = require('../settings.' + process.env.NODE_ENV + '.json');

export function Table(constructor: Function) {
    console.log(constructor);
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
        Reflect.defineMetadata('pk', metadata.pk, target, name);
        Reflect.defineMetadata('caption', metadata.caption, target, name);
        Reflect.defineMetadata('size', metadata.size, target, name);
        Reflect.defineMetadata('decimal', metadata.decimal, target, name);
        Reflect.defineMetadata('nullable', metadata.nullable, target, name);
        Reflect.defineMetadata('index', metadata.index, target, name);
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
