import type ActorSkill from './actor-skill.js';
import type Weapon from './weapon.js';

export default class Attack {
  weapon: Weapon;
  attackBonus: number;
  attackTarget: number;
  associatedSkill: ActorSkill;

  constructor(
    weapon: Weapon,
    associatedSkill: ActorSkill,
    attackBonus: number,
    attackTarget: number
  ) {
    this.weapon = weapon;
    this.associatedSkill = associatedSkill;
    this.attackBonus = attackBonus;
    this.attackTarget = attackTarget;
  }
}
