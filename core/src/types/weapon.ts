import type { DamageType } from './damage-type.ts';
import type DiceFormula from './dice-formula.ts';
import type { EnergyDamageType } from './energy-damage-type.ts';
import Item from './item.ts';
import type { KineticDamageType } from './kinetic-damage-types.ts';
import type Skill from './skill.ts';

export default class Weapon extends Item {
    #primaryDamageType: DamageType;
    #primarySubDamageType: KineticDamageType | EnergyDamageType;
    #hasSecondaryDamageType: boolean;
    #secondarySubDamageType: KineticDamageType | EnergyDamageType | null;
    #secondaryDamageType: DamageType | null;
    #damage: DiceFormula;
    #secondaryDamage: DiceFormula | null;
    #associatedSkill: Skill | null;
    constructor(
        name: string,
        primaryDamageType: DamageType,
        primarySubDamageType: KineticDamageType | EnergyDamageType,
        damage: DiceFormula,
        bulk: number = 0,
        price: number = 0,
        associatedSkill: Skill | null
    ) {
        super(name, bulk, price);
        this.#primaryDamageType = primaryDamageType;
        this.#primarySubDamageType = primarySubDamageType;
        this.#hasSecondaryDamageType = false;
        this.#secondaryDamage = null;
        this.#secondaryDamageType = null;
        this.#secondarySubDamageType = null;
        this.#damage = damage;
        this.#secondaryDamageType = null;
        this.#associatedSkill = associatedSkill;
    }

    get primaryDamageType(): DamageType {
        return this.#primaryDamageType;
    }

    set primaryDamageType(value: DamageType) {
        this.#primaryDamageType = value;
    }

    get primarySubDamageType(): KineticDamageType | EnergyDamageType {
        return this.#primarySubDamageType;
    }

    set primarySubDamageType(value: KineticDamageType | EnergyDamageType) {
        this.#primarySubDamageType = value;
    }

    get secondaryDamageType(): DamageType | null {
        return this.#secondaryDamageType;
    }

    set secondaryDamageType(value: DamageType) {
        this.#hasSecondaryDamageType = true;
        this.#secondaryDamageType = value;
    }

    set secondarySubDamageType(value: KineticDamageType | EnergyDamageType | null) {
        this.#secondarySubDamageType = value;
    }

    get secondarySubDamageType(): KineticDamageType | EnergyDamageType | null {
        return this.#secondarySubDamageType;
    }

    get hasSecondaryDamageType(): boolean {
        return this.#hasSecondaryDamageType;
    }

    get damage(): DiceFormula {
        return this.#damage;
    }

    get secondaryDamage(): DiceFormula | null {
        return this.#secondaryDamage;
    }

    set secondaryDamage(value: DiceFormula | null) {
        this.#secondaryDamage = value;
    }

    get associatedSkill(): Skill | null {
        return this.#associatedSkill;
    }
}
