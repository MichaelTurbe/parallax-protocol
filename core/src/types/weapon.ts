import type { DamageType } from './damage-type.ts';
import type DiceFormula from './dice-formula.ts';
import type { EnergyDamageType } from './energy-damage-type.ts';
import Item from './item.ts';
import type { KineticDamageType } from './kinetic-damage-types.ts';
import type Skill from './skill.ts';

export default class Weapon extends Item {
  primaryDamageType: DamageType;
  primarySubDamageType: KineticDamageType | EnergyDamageType;

  // If you want “hasSecondaryDamageType” as a *derived truth*,
  // you can omit this property and compute it from secondaryDamageType !== null.
  // But I'm keeping it because your original class stored it explicitly.
  hasSecondaryDamageType: boolean;

  secondaryDamageType: DamageType | null;
  secondarySubDamageType: KineticDamageType | EnergyDamageType | null;

  damage: DiceFormula;
  secondaryDamage: DiceFormula | null;

  associatedSkill: Skill | null;

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

    this.primaryDamageType = primaryDamageType;
    this.primarySubDamageType = primarySubDamageType;

    this.damage = damage;

    this.secondaryDamage = null;
    this.secondaryDamageType = null;
    this.secondarySubDamageType = null;

    this.hasSecondaryDamageType = false;

    this.associatedSkill = associatedSkill;
  }

  /**
   * Optional helper to preserve your old setter semantics:
   * setting a secondary damage type also flips the flag.
   * (Not required, but it keeps call sites clean.)
   */
  setSecondaryDamageType(value: DamageType | null): void {
    this.secondaryDamageType = value;
    this.hasSecondaryDamageType = value !== null;
  }
}
