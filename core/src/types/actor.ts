import type { ActorSize } from './actor-size.ts';
import type ActorSkill from './actor-skill.ts';
import type Attack from './attack.ts';
import DamageReduction from './damage-reduction.ts';
import type DiceFormula from './dice-formula.ts';
import type StatBonus from './stat-bonus.ts';
import pc from 'picocolors';

export default class Actor {
  name: string;
  hitDie: DiceFormula;
  level: number;

  kineticDamageReduction: DamageReduction;
  energyDamageReduction: DamageReduction;

  skills: Array<ActorSkill>;
  stats: Array<StatBonus>;
  attacks?: Array<Attack>;

  size?: ActorSize;

  constructor(
    name: string,
    hitDie: DiceFormula,
    level: number
  ) {
    this.name = name;
    this.hitDie = hitDie;
    this.level = level;

    // initialize once (important!)
    this.kineticDamageReduction = new DamageReduction(0, 0, 0, 0);
    this.energyDamageReduction = new DamageReduction(0, 0, 0, 0);

    this.skills = [];
    this.stats = [];
    this.attacks = undefined;
    this.size = undefined;
  }

  toJSON() {
    return {
      name: pc.green(this.name),
      damage: pc.red(this.level),
    };
  }
}
