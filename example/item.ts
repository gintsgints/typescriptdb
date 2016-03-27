import {Model, Table, Field} from '../index';

// Model definition using table and field decorators for metadata
@Table('item_table_name')
export class Item extends Model {
    @Field({ pk: true, caption: "Part No.", size: 9 })
    Partno: string = "Default";
    
    @Field({})
    Name: string;

    @Field({ caption: "In Stock", size: 2 })
    Instock: number = 0;
    
}
