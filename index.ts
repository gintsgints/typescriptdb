// --- Model definitions

enum FIELD_TYPE {string, number, datetime, text}

interface Field {
  pk?: boolean;
  name: string;
  type: FIELD_TYPE;
  caption?: string;
  size: number;
  decimal?: number;
  default?: string;
  null?: boolean;
  index?: boolean;
}

interface Model {
  tableName: string;
  fields: Array<Field>;
}

// --- Migration definitions
class MigrationBase {
   Up() {
       
   };
   Down() {
       
   };
}
