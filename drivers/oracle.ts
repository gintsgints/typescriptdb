/// <reference path="../index.ts"/>

class Migration extends MigrationBase {
   CreateTable(Model) {
       console.log('Creating oracle table');
   };
   DropTable(string) {
       console.log('Dropping oracle table');       
   };
}
