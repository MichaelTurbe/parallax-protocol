import { DamageTypes } from '../types/damage-type.ts';
import DiceFormula from '../types/dice-formula.ts';
import { DiceTypes } from '../types/die-type.ts';
import { KineticDamageTypes } from '../types/kinetic-damage-types.ts';
// import type MeleeWeapon from '../types/melee-weapon.ts';
import RangedWeapon from '../types/ranged-weapon.ts';
import type Weapon from '../types/weapon.ts';

export default class WeaponsService {
    //  #smallArms: Array<RangedWeapon>;
    #longArms: Array<RangedWeapon>;
    //  #heavyArms: Array<RangedWeapon>;
    //  #meleeWeapons: Array<MeleeWeapon>;
    #nameDictionary: Map<string, Weapon> = new Map<string, Weapon>();

    constructor() {
        this.#longArms = this.#populateLongArms();
    }

    #populateLongArms() {
        const longArms = new Array<RangedWeapon>();
        longArms.push(
            new RangedWeapon(
                'Gauss Rifle',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d10, 1, 0),
                1,
                0,
                new DiceFormula(DiceTypes.d12, 1, 0),
                30,
                100,
                200
            )
        );
        return longArms;
    }

    get allLongArms(): Array<RangedWeapon> {
        return this.#longArms;
    }
    get allWeapons(): Array<Weapon> {
        return [
            ...this.#longArms,
            // ...this.#intellectualSkills,
            // ...this.#physicalSkills,
            // ...this.#subtleSkills,
        ];
    }

    private populateWeaponMap() {
        this.allWeapons.forEach((skill) => {
            this.#nameDictionary.set(skill.name, skill);
        });
    }

    getWeaponByName(name: string): Weapon | null {
        return this.#nameDictionary.get(name) ?? null;
    }
}
