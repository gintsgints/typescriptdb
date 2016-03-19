export enum FIELD_TYPE {string, number, datetime, text}

export interface Field {
pk?: boolean;
name: string;
type: FIELD_TYPE;
caption?: string;
size?: number;
decimal?: number;
default?: string;
null?: boolean;
index?: boolean;
}

export class Model {
    tableName: string;
    fields: Array<Field>;
}

// --- Migration definitions
export class MigrationBase {
Up() {
    
};
Down() {
    
};
}

