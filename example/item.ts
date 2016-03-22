import {Model, Table, Field} from '../index';

@Table('item_table_name')
export class Item extends Model {
    @Field({ caption: "Part No.", size: 9 })
    Partno: string = "Default";
    
    @Field({ caption: "In Stock", size: 2 })
    Instock: number = 0;
}
