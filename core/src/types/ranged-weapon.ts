import type { DamageType } from './damage-type.js';
import type DiceFormula from './dice-formula.js';
import type { EnergyDamageType } from './energy-damage-type.js';
import type { KineticDamageType } from './kinetic-damage-types.js';
import type Skill from './skill.js';
import Weapon from './weapon.js';

export default class RangedWeapon extends Weapon {
  automaticDamage: DiceFormula | null;
  shortRange: number;
  longRange: number;
  maxRange: number;

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
    super(
      name,
      primaryDamageType,
      primarySubDamageType,
      damage,
      bulk,
      price,
      associatedSkill
    );

    this.automaticDamage = automaticDamage;
    this.shortRange = shortRange;
    this.longRange = longRange;
    this.maxRange = maxRange;
  }
}
