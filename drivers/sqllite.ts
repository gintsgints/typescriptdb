/// <reference path="../index.ts"/>

class Migration extends MigrationBase {
   CreateTable(Model) {
       console.log('Creating sqlite table');
   };
   DropTable(string) {
       console.log('Dropping sqlite table');       
   };
}
