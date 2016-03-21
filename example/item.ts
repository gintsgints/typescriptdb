import {Table, Field} from '../index';

@Table
export class Item {
    @Field({ caption: "Part No.", size: 9 })
    Partno: string = "Default";
    
    @Field({ caption: "In Stock", size: 2 })
    Instock: number = 0;
}
