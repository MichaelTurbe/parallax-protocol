import type ActorSkill from './actor-skill.ts';
import type Weapon from './weapon.ts';

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
