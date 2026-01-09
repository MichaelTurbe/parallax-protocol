export default class Item {
    #bulk?: number;
    #price?: number;
    #name: string;

    constructor(name: string, bulk: number = 0, price: number = 0) {
        this.#bulk = bulk;
        this.#price = price;
        this.#name = name;
    }

    get bulk(): number {
        return this.#bulk ?? 0;
    }

    get price(): number {
        return this.#price || 0;
    }

    get name(): string {
        return this.#name;
    }
}
