import Item from './item.ts';

export default class Weapon extends Item {
    constructor(name: string, bulk: number = 0, price: number = 0) {
        super(name, bulk, price);
    }
}
