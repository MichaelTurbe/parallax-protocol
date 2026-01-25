import type { ActorSize } from './actor-size.js';
import type ActorSkill from './actor-skill.js';
import type Attack from './attack.js';
import DamageReduction from './damage-reduction.js';
import type DiceFormula from './dice-formula.js';
import type StatBonus from './stat-bonus.js';
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
