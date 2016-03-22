import {DriverInterface} from "../index"

export class Driver implements DriverInterface {
    Save():void {
        console.log("Driver saving object");
    }
} 