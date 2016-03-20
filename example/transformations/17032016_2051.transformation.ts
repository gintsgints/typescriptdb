import {Migration} from '../../index';
import {item} from '../item';

export var migration = new Migration;
migration.Up = function() {
    this.CreateTable(item);
}
migration.Down = function() {
    this.DropTable(item);
}
