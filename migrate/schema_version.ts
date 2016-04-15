import {Model, Table, Field} from '../index';

// --- Example usage
// Model definition using table and field decorators for metadata
@Table('schema_version')
export class SchemaVersion extends Model {
    @Field({ pk: true, size: 9 })
    version: string = '';

    @Field({ caption: "Description", size: 50 })
    desc: string;

    @Field({ caption: "Apply date" })
    dateTime: Date;

    @Field({ caption: "State", size: 2 })
    state: string;
}
