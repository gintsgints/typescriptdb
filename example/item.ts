import {Model} from '../index';
import {FIELD_TYPE} from '../index';

// --- Example usage
export var item = new Model();

item.tableName = 'item';
item.fields = [
  { type: FIELD_TYPE.string, name: "partno", caption:"Part No.", size: 2, pk: true },
  { type: FIELD_TYPE.number, name: "instock", caption: "In Stock", size: 2 }    
]

