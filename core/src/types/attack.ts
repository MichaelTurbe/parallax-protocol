import type ActorSkill from './actor-skill.ts';
import type Weapon from './weapon.ts';

export default class Attack {
    #weapon: Weapon;
    #attackBonus: number;
    #attackTarget: number;
    #associatedSkill: ActorSkill;

    constructor(
        weapon: Weapon,
        associatedSkill: ActorSkill,
        attackBonus: number,
        attackTarget: number
    ) {
        this.#weapon = weapon;
        this.#attackBonus = attackBonus;
        this.#attackTarget = attackTarget;
        this.#associatedSkill = associatedSkill;
    }

    // --- Getters ---
    get weapon(): Weapon {
        return this.#weapon;
    }

    get attackBonus(): number {
        return this.#attackBonus;
    }

    get attackTarget(): number {
        return this.#attackTarget;
    }

    get associatedSkill(): ActorSkill {
        return this.#associatedSkill;
    }

    // --- Setters ---
    set weapon(value: Weapon) {
        this.#weapon = value;
    }

    set attackBonus(value: number) {
        this.#attackBonus = value;
    }

    set attackTarget(value: number) {
        this.#attackTarget = value;
    }
}
