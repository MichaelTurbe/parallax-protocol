import type { DamageType } from './damage-type.ts';
import type DiceFormula from './dice-formula.ts';
import type { EnergyDamageType } from './energy-damage-type.ts';
import type { KineticDamageType } from './kinetic-damage-types.ts';
import type Skill from './skill.ts';
import Weapon from './weapon.ts';

export default class RangedWeapon extends Weapon {
    #automaticDamage: DiceFormula | null;
    #shortRange: number;
    #longRange: number;
    #maxRange: number;
    constructor(
        name: string,
        primaryDamageType: DamageType,
        primarySubDamageType: KineticDamageType | EnergyDamageType,
        damage: DiceFormula,
        bulk: number = 0,
        price: number = 0,
        automaticDamage: DiceFormula | null,
        shortRange: number,
        longRange: number,
        maxRange: number,
        associatedSkill: Skill | null
    ) {
        super(name, primaryDamageType, primarySubDamageType, damage, bulk, price, associatedSkill);
        this.#automaticDamage = automaticDamage;
        this.#shortRange = shortRange;
        this.#longRange = longRange;
        this.#maxRange = maxRange;
    }

    // --- Getters ---
    get automaticDamage(): DiceFormula | null {
        return this.#automaticDamage ?? null;
    }

    get shortRange(): number {
        return this.#shortRange;
    }

    get longRange(): number {
        return this.#longRange;
    }

    get maxRange(): number {
        return this.#maxRange;
    }

    // --- Setters ---
    set automaticDamage(value: DiceFormula) {
        this.#automaticDamage = value;
    }

    set shortRange(value: number) {
        this.#shortRange = value;
    }

    set longRange(value: number) {
        this.#longRange = value;
    }

    set maxRange(value: number) {
        this.#maxRange = value;
    }
}
