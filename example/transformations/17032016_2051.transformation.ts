/// <reference path="../item.ts"/>

class CreateItemTable extends Migration {
    Up() {
        this.CreateTable(item);    
    }
    Down() {
        this.DropTable(item.tableName);
    }    
}
