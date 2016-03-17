/// <reference path="../index.ts"/>
/// <reference path="../drivers/oracle.ts"/>

// --- Example usage
var item: Model;

item.fields = [
  { type: FIELD_TYPE.string, name: "partno", caption:"Part No.", size: 2, pk: true },
  { type: FIELD_TYPE.number, name: "instock", caption: "In Stock", size: 2 }    
]

