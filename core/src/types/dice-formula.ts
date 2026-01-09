import type { DieType } from './die-type.ts';

export default class DiceFormula {
    #dieType: DieType;
    #diceNumber: number;
    #bonus: number;
    constructor(dieType: DieType, diceNumber: number, bonus: number) {
        this.#dieType = dieType;
        this.#diceNumber = diceNumber;
        this.#bonus = bonus;
    }

    // --- Getters ---
    get dieType(): DieType {
        return this.#dieType;
    }

    get diceNumber(): number {
        return this.#diceNumber;
    }

    get bonus(): number {
        return this.#bonus;
    }

    // --- Setters ---
    set dieType(value: DieType) {
        this.#dieType = value;
    }

    set diceNumber(value: number) {
        this.#diceNumber = value;
    }

    set bonus(value: number) {
        this.#bonus = value;
    }
}
