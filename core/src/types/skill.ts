import type { SkillCategory } from './skill-category.js';
import type { SkillName } from './skill-name.ts';
import type { Stat } from './stat.ts';

export default class Skill {
  name: SkillName;
  applicableStat: Stat;
  category: SkillCategory;

  constructor(
    name: SkillName,
    category: SkillCategory,
    applicableStat: Stat
  ) {
    this.name = name;
    this.category = category;
    this.applicableStat = applicableStat;
  }
}
