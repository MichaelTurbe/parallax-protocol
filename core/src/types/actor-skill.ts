import type Skill from './skill.ts';

export default class ActorSkill {
    #skill: Skill;
    #trained?: boolean;
    #statBonus?: number;
    #trainedSkillBonus?: number;
    #itemBonus?: number;
    #totalSkillBonus: number;
    #skillTarget: number;

    constructor(
        skill: Skill,
        trainedSkillBonus: number,
        skillTarget: number,
        totalSkillBonus: number
    ) {
        this.#skill = skill;
        this.#trainedSkillBonus = trainedSkillBonus;
        this.#skillTarget = skillTarget;
        this.#totalSkillBonus = totalSkillBonus;
    }

    get skill(): Skill {
        return this.#skill;
    }

    get trainedSkilLBonus(): number {
        return this.#trainedSkillBonus || 0;
    }

    get trained(): boolean {
        return this.#trained || false;
    }

    set trained(trained: boolean) {
        this.#trained = trained;
    }

    get itemBonus(): number {
        return this.#itemBonus || 0;
    }

    set itemBonus(value: number) {
        this.#itemBonus = value;
    }

    get statBonus(): number {
        return this.#statBonus || 0;
    }

    set statBonus(value: number) {
        this.#statBonus = value;
    }

    get totalSkillBonus(): number {
        return this.#totalSkillBonus || 0;
    }

    set totalSkillBonus(value: number) {
        this.#totalSkillBonus = value;
    }

    get skillTarget(): number {
        return this.#skillTarget || 0;
    }

    set skillTarget(value: number) {
        this.#skillTarget = value;
    }
}
