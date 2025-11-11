import { DamageTypes } from '../types/damage-type.ts';
import DiceFormula from '../types/dice-formula.ts';
import { DiceTypes } from '../types/die-type.ts';
import { EnergyDamageTypes } from '../types/energy-damage-type.ts';
import { KineticDamageTypes } from '../types/kinetic-damage-types.ts';
// import type MeleeWeapon from '../types/melee-weapon.ts';
import RangedWeapon from '../types/ranged-weapon.ts';
import type Weapon from '../types/weapon.ts';

export default class WeaponsService {
    #smallArms: Array<RangedWeapon>;
    #longArms: Array<RangedWeapon>;
    #heavyArms: Array<RangedWeapon>;
    //  #meleeWeapons: Array<MeleeWeapon>;
    #nameDictionary: Map<string, Weapon> = new Map<string, Weapon>();

    constructor() {
        this.#longArms = this.#populateLongArms();
        this.#smallArms = this.#populateSmallArms();
        this.#heavyArms = this.#populateHeavyArms();
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
        longArms.push(
            new RangedWeapon(
                'Laser Rifle',
                DamageTypes.Energy,
                EnergyDamageTypes.Fire,
                new DiceFormula(DiceTypes.d10, 1, 0),
                1,
                0,
                new DiceFormula(DiceTypes.d12, 1, 0),
                30,
                100,
                200
            )
        );
        longArms.push(
            new RangedWeapon(
                'Arc Rifle',
                DamageTypes.Energy,
                EnergyDamageTypes.Electrical,
                new DiceFormula(DiceTypes.d10, 1, 0),
                1,
                0,
                new DiceFormula(DiceTypes.d12, 1, 0),
                10,
                30,
                60
            )
        );

        longArms.push(
            new RangedWeapon(
                'Plasma Rifle',
                DamageTypes.Energy,
                EnergyDamageTypes.Fire,
                new DiceFormula(DiceTypes.d10, 1, 0),
                1,
                0,
                null,
                20,
                40,
                80
            )
        );

        longArms.push(
            new RangedWeapon(
                'Slug Rifle',
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

        longArms.push(
            new RangedWeapon(
                'Stun Rifle',
                DamageTypes.Energy,
                EnergyDamageTypes.Electrical,
                new DiceFormula(DiceTypes.d8, 1, 0),
                1,
                0,
                new DiceFormula(DiceTypes.d8, 1, 0),
                30,
                50,
                90
            )
        );

        longArms.push(
            new RangedWeapon(
                'Gauss Sniper Rifle',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d12, 1, 0),
                1,
                0,
                null,
                200,
                400,
                600
            )
        );

        longArms.push(
            new RangedWeapon(
                'Slug Sniper Rifle',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d12, 1, 0),
                1,
                0,
                null,
                200,
                400,
                600
            )
        );

        return longArms;
    }

    #populateSmallArms() {
        const weapons = new Array<RangedWeapon>();
        weapons.push(
            new RangedWeapon(
                'Gauss Pistol',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d8, 1, 0),
                0,
                0,
                new DiceFormula(DiceTypes.d10, 1, 0),
                30,
                100,
                200
            )
        );
        weapons.push(
            new RangedWeapon(
                'Laser Pistol',
                DamageTypes.Energy,
                EnergyDamageTypes.Fire,
                new DiceFormula(DiceTypes.d8, 1, 0),
                0,
                0,
                null,
                30,
                100,
                200
            )
        );
        weapons.push(
            new RangedWeapon(
                'Arc Pistol',
                DamageTypes.Energy,
                EnergyDamageTypes.Electrical,
                new DiceFormula(DiceTypes.d6, 1, 0),
                0,
                0,
                null,
                10,
                30,
                60
            )
        );

        weapons.push(
            new RangedWeapon(
                'Plasma Pistol',
                DamageTypes.Energy,
                EnergyDamageTypes.Fire,
                new DiceFormula(DiceTypes.d8, 1, 0),
                0,
                0,
                null,
                20,
                40,
                80
            )
        );

        weapons.push(
            new RangedWeapon(
                'Slug Pistol',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d6, 1, 0),
                0,
                0,
                new DiceFormula(DiceTypes.d8, 1, 0),
                30,
                100,
                200
            )
        );

        weapons.push(
            new RangedWeapon(
                'Stun Pistol',
                DamageTypes.Energy,
                EnergyDamageTypes.Electrical,
                new DiceFormula(DiceTypes.d4, 1, 0),
                1,
                0,
                null,
                20,
                40,
                80
            )
        );

        return weapons;
    }

    #populateHeavyArms() {
        const weapons = new Array<RangedWeapon>();
        weapons.push(
            new RangedWeapon(
                'Gauss Canon',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d8, 3, 0),
                3,
                0,
                new DiceFormula(DiceTypes.d6, 3, 0),
                30,
                100,
                200
            )
        );
        weapons.push(
            new RangedWeapon(
                'Laser Canaon',
                DamageTypes.Energy,
                EnergyDamageTypes.Fire,
                new DiceFormula(DiceTypes.d8, 3, 0),
                3,
                0,
                null,
                30,
                100,
                200
            )
        );
        weapons.push(
            new RangedWeapon(
                'Arc Canon',
                DamageTypes.Energy,
                EnergyDamageTypes.Electrical,
                new DiceFormula(DiceTypes.d12, 1, 0),
                3,
                0,
                new DiceFormula(DiceTypes.d10, 1, 0),
                10,
                30,
                60
            )
        );

        weapons.push(
            new RangedWeapon(
                'Plasma Canon',
                DamageTypes.Energy,
                EnergyDamageTypes.Fire,
                new DiceFormula(DiceTypes.d6, 3, 0),
                3,
                0,
                new DiceFormula(DiceTypes.d6, 2, 0),
                20,
                40,
                80
            )
        );

        weapons.push(
            new RangedWeapon(
                'Minigun',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d8, 4, 0),
                4,
                0,
                new DiceFormula(DiceTypes.d8, 3, 0),
                30,
                100,
                200
            )
        );

        weapons.push(
            new RangedWeapon(
                'Grenade Launcher',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d8, 1, 0),
                4,
                0,
                null,
                200,
                400,
                600
            )
        );

        return weapons;
    }

    get allLongArms(): Array<RangedWeapon> {
        return this.#longArms;
    }
    get allWeapons(): Array<Weapon> {
        return [
            ...this.#longArms,
            ...this.#smallArms,
            ...this.#heavyArms,
            // ...this.#subtleSkills,
        ];
    }

    private populateWeaponMap() {
        this.allWeapons.forEach((skill) => {
            this.#nameDictionary.set(skill.name.toLowerCase(), skill);
        });
    }

    getWeaponByName(name: string): Weapon | null {
        return this.#nameDictionary.get(name.toLowerCase()) ?? null;
    }
}
