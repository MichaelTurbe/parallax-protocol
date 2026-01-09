import { DamageTypes } from '../types/damage-type.ts';
import DiceFormula from '../types/dice-formula.ts';
import { DiceTypes } from '../types/die-type.ts';
import { EnergyDamageTypes } from '../types/energy-damage-type.ts';
import { KineticDamageTypes } from '../types/kinetic-damage-types.ts';
import MeleeWeapon from '../types/melee-weapon.ts';
// import type MeleeWeapon from '../types/melee-weapon.ts';
import RangedWeapon from '../types/ranged-weapon.ts';
import { SkillNames } from '../types/skill-name.ts';
import type Weapon from '../types/weapon.ts';
import type SkillService from './SkillService.ts';

export default class WeaponsService {
    #skillService: SkillService;
    #smallArms: Array<RangedWeapon>;
    #longArms: Array<RangedWeapon>;
    #heavyArms: Array<RangedWeapon>;
    #meleeWeapons: Array<MeleeWeapon>;
    #naturalWeapons: Array<MeleeWeapon>;
    #nameDictionary: Map<string, Weapon> = new Map<string, Weapon>();

    constructor(skillService: SkillService) {
        this.#skillService = skillService;
        this.#longArms = this.#populateLongArms();
        this.#smallArms = this.#populateSmallArms();
        this.#heavyArms = this.#populateHeavyArms();
        this.#meleeWeapons = this.#populateMeleeWeapons();
        this.#naturalWeapons = this.#populateNaturalWeapons();
        this.populateWeaponMap();
    }
    #populateMeleeWeapons() {
        const meleeWeapons = new Array<MeleeWeapon>();
        const meleeWeaponsSkill = this.#skillService.getSkillBySkillName(SkillNames.MeleeWeapons);
        meleeWeapons.push(
            new MeleeWeapon(
                'Piezo Dagger',
                DamageTypes.Kinetic,
                KineticDamageTypes.Slashing,
                new DiceFormula(DiceTypes.d6, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Dagger',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d4, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Sword',
                DamageTypes.Kinetic,
                KineticDamageTypes.Slashing,
                new DiceFormula(DiceTypes.d8, 1, 0),
                1,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Piezo Sword',
                DamageTypes.Kinetic,
                KineticDamageTypes.Slashing,
                new DiceFormula(DiceTypes.d10, 1, 0),
                1,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Titanium Cudgel',
                DamageTypes.Kinetic,
                KineticDamageTypes.Bludgeoning,
                new DiceFormula(DiceTypes.d8, 1, 0),
                1,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Titanium Staff',
                DamageTypes.Kinetic,
                KineticDamageTypes.Bludgeoning,
                new DiceFormula(DiceTypes.d8, 1, 0),
                2,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Stun Baton',
                DamageTypes.Kinetic,
                KineticDamageTypes.Bludgeoning,
                new DiceFormula(DiceTypes.d4, 1, 0),
                1,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Stun Staff',
                DamageTypes.Kinetic,
                KineticDamageTypes.Bludgeoning,
                new DiceFormula(DiceTypes.d6, 1, 0),
                2,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Plasma Fibril Sword',
                DamageTypes.Energy,
                EnergyDamageTypes.Fire,
                new DiceFormula(DiceTypes.d6, 2, 0),
                1,
                0,
                meleeWeaponsSkill
            )
        );

        const shockHammer = new MeleeWeapon(
            'Shock Hammer',
            DamageTypes.Kinetic,
            KineticDamageTypes.Bludgeoning,
            new DiceFormula(DiceTypes.d6, 2, 0),
            3,
            0,
            meleeWeaponsSkill
        );
        shockHammer.secondaryDamageType = DamageTypes.Energy;
        shockHammer.secondarySubDamageType = EnergyDamageTypes.Electrical;
        shockHammer.secondaryDamage = new DiceFormula(DiceTypes.d8, 1, 0);
        meleeWeapons.push(shockHammer);

        return meleeWeapons;
    }

    #populateNaturalWeapons() {
        const meleeWeapons = new Array<MeleeWeapon>();
        const meleeWeaponsSkill = this.#skillService.getSkillBySkillName(SkillNames.MeleeWeapons);
        meleeWeapons.push(
            new MeleeWeapon(
                'Claws - Small',
                DamageTypes.Kinetic,
                KineticDamageTypes.Slashing,
                new DiceFormula(DiceTypes.d4, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Claws - Medium',
                DamageTypes.Kinetic,
                KineticDamageTypes.Slashing,
                new DiceFormula(DiceTypes.d6, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Claws - Large',
                DamageTypes.Kinetic,
                KineticDamageTypes.Slashing,
                new DiceFormula(DiceTypes.d8, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Claws - Huge',
                DamageTypes.Kinetic,
                KineticDamageTypes.Slashing,
                new DiceFormula(DiceTypes.d10, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Claws - Enormous',
                DamageTypes.Kinetic,
                KineticDamageTypes.Slashing,
                new DiceFormula(DiceTypes.d12, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Jaws - Small',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d4, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Jaws - Medium',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d6, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Jaws - Large',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d8, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Jaws - Huge',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d10, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Jaws - Enormous',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d12, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Paws - Small',
                DamageTypes.Kinetic,
                KineticDamageTypes.Bludgeoning,
                new DiceFormula(DiceTypes.d4, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Paws - Medium',
                DamageTypes.Kinetic,
                KineticDamageTypes.Bludgeoning,
                new DiceFormula(DiceTypes.d6, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Paws - Large',
                DamageTypes.Kinetic,
                KineticDamageTypes.Bludgeoning,
                new DiceFormula(DiceTypes.d8, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Paws - Huge',
                DamageTypes.Kinetic,
                KineticDamageTypes.Bludgeoning,
                new DiceFormula(DiceTypes.d10, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Paws - Enormous',
                DamageTypes.Kinetic,
                KineticDamageTypes.Bludgeoning,
                new DiceFormula(DiceTypes.d12, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Horns - Small',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d4, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Horns - Medium',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d6, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Horns - Large',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d8, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Horns - Huge',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d10, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );

        meleeWeapons.push(
            new MeleeWeapon(
                'Horns - Enormous',
                DamageTypes.Kinetic,
                KineticDamageTypes.Piercing,
                new DiceFormula(DiceTypes.d12, 1, 0),
                0,
                0,
                meleeWeaponsSkill
            )
        );
        return meleeWeapons;
    }

    #populateLongArms() {
        const longArms = new Array<RangedWeapon>();
        const longArmsSkill = this.#skillService.getSkillBySkillName(SkillNames.FirearmsLong);
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
                200,
                longArmsSkill
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
                200,
                longArmsSkill
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
                60,
                longArmsSkill
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
                80,
                longArmsSkill
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
                200,
                longArmsSkill
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
                90,
                longArmsSkill
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
                600,
                longArmsSkill
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
                600,
                longArmsSkill
            )
        );

        return longArms;
    }

    #populateSmallArms() {
        const weapons = new Array<RangedWeapon>();
        const smallArmsSkill = this.#skillService.getSkillBySkillName(SkillNames.FirearmsSmall);

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
                200,
                smallArmsSkill
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
                200,
                smallArmsSkill
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
                60,
                smallArmsSkill
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
                80,
                smallArmsSkill
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
                200,
                smallArmsSkill
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
                80,
                smallArmsSkill
            )
        );

        return weapons;
    }

    #populateHeavyArms() {
        const weapons = new Array<RangedWeapon>();
        const heavyArmsSkill = this.#skillService.getSkillBySkillName(SkillNames.FirearmsHeavy);

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
                200,
                heavyArmsSkill
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
                200,
                heavyArmsSkill
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
                60,
                heavyArmsSkill
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
                80,
                heavyArmsSkill
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
                200,
                heavyArmsSkill
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
                600,
                heavyArmsSkill
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
            ...this.#meleeWeapons,
            ...this.#naturalWeapons,
        ];
    }

    get allNaturalWeapons(): Array<Weapon> {
        return this.#naturalWeapons;
    }

    private populateWeaponMap() {
        this.allWeapons.forEach((weapon) => {
            this.#nameDictionary.set(weapon.name.toLowerCase(), weapon);
        });
    }

    getWeaponByName(name: string): Weapon | null {
        return this.#nameDictionary.get(name.toLowerCase()) ?? null;
    }
}
