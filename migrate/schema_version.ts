import {Model} from '../index';
import {FIELD_TYPE} from '../index';

// --- Example usage
export var schema_version = new Model();

schema_version.tableName = 'schema_version';
schema_version.fields = [
  { type: FIELD_TYPE.number, name: "version", caption:"Database version", size: 2, pk: true },
  { type: FIELD_TYPE.text, name: "desc", caption: "Change Description" },    
  { type: FIELD_TYPE.datetime, name: "apply", caption: "Aplly date", size: 2 },    
  { type: FIELD_TYPE.string, name: "state", caption: "State", size: 2 }    
]

