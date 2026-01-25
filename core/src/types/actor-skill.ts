import type Skill from './skill.js';

export default class ActorSkill {
  skill: Skill;

  // Optional in the original, but you always read them with defaults.
  trained: boolean;
  statBonus: number;
  trainedSkillBonus: number;
  itemBonus: number;
  totalSkillBonus: number;
  skillTarget: number;

  constructor(
    skill: Skill,
    trainedSkillBonus: number,
    skillTarget: number,
    totalSkillBonus: number
  ) {
    this.skill = skill;

    // preserve the “|| 0” / “|| false” semantics explicitly
    this.trained = false;
    this.statBonus = 0;
    this.itemBonus = 0;

    this.trainedSkillBonus = trainedSkillBonus ?? 0;
    this.skillTarget = skillTarget ?? 0;
    this.totalSkillBonus = totalSkillBonus ?? 0;
  }
}
