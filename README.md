# typescriptdb [![Build Status](https://travis-ci.org/gintsgints/typescriptdb.svg?branch=master)](https://travis-ci.org/gintsgints/typescriptdb)
Database backend for node, powered by typescript.

# Project closed in favor to existing good alternative
Take look here - https://typeorm.github.io/

# Objectives
* Typescript class based definitions of database objects
* Migrations for database changes (migrations should support Up/Down migrations)
* Easy support for different backend databases
* Possibility simply build REST servers

# Usage
You have to install apropriate nodejs driver for your sql. For example

```
npm install sqlite3
```

For sqlite driver. 

# Example

By now working example is as flollow:

```
import "reflect-metadata";
import {Driver} from '../drivers/sqlite';
import {Model, Table, Field} from '../index';

// Before we initiate model we need driver
var driver = new Driver();

@Table('item_table_name')
export class Item extends Model {
    @Field({ pk: true, caption: "Part No.", size: 9 })
    Partno: number = 0;
    
    @Field({})
    Name: string;

    @Field({ caption: "In Stock", size: 2 })
    Instock: number = 0;    
}

// Find existing object (Find works by primary key)
var record = new Item(driver);
record.Partno = 234;
record.Name = "Part number 234 name";
record.Instock = 3;
record.Save(function(err, result) {
    if (err) {
        console.log("Error while saving part");
    } else {
        // now let's try find that part.
        var newpart = new Item(driver);
        newpart.Partno = 234;
        newpart.Find(function(err, result) {
            if (err) {
                console.log("Error while find part");
            } else {
                console.log("Part found:", newpart);
            }
        })
    } 
})
```