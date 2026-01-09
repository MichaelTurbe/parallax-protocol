import type { SkillCategory } from './skill-category.js'; // type
import type { SkillName } from './skill-name.ts';
import type { Stat } from './stat.ts';

export default class Skill {
    #name: SkillName;
    #applicableStat: Stat;
    #category: SkillCategory;

    constructor(name: SkillName, skillCategory: SkillCategory, applicableStat: Stat) {
        this.#name = name;
        this.#applicableStat = applicableStat;
        this.#category = skillCategory;
    }

    get name(): SkillName {
        return this.#name;
    }

    get applicableStat(): Stat {
        return this.#applicableStat;
    }

    get category(): SkillCategory {
        return this.#category;
    }
}
