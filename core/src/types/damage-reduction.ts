export default class DamageReduction {
    #body: number;
    #armor: number;
    #field: number;
    #total: number;

    constructor(body: number, armor: number, field: number, total: number) {
        this.#armor = armor;
        this.#body = body;
        this.#field = field;
        this.#total = total;
    }

    get body(): number {
        return this.#body;
    }
    set body(value: number) {
        this.#body = value;
    }

    get armor(): number {
        return this.#armor;
    }
    set armor(value: number) {
        this.#armor = value;
    }

    get field(): number {
        return this.#field;
    }
    set field(value: number) {
        this.#field = value;
    }

    get total(): number {
        return this.#total;
    }
    set total(value: number) {
        this.#total = value;
    }
}
