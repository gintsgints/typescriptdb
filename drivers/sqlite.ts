import {DriverInterface, DriverBase} from "../index"

export class Driver extends DriverBase implements DriverInterface {
    Save(obj: Object):void {
        console.log("Saving object... what data we have about it:");
        var fields = this.getFields(obj);
        console.log('Fields:', fields);
        console.log('Primary Keys:', this.getPrimaryKeys(obj));
        console.log('First field proprties:', this.getProperties(obj, fields[0]));
    }
}