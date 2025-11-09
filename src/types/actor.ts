import type ActorSkill from './actor-skill.ts';
import DamageReduction from './damage-reduction.ts';
import type StatBonus from './stat-bonus.ts';

export default class Actor {
    #name: string;
    #hitDie?: number;
    #hitDieBonus?: number;
    #level: number;
    #kineticDamageReduction?: DamageReduction;
    #energyDamageReduction?: DamageReduction;
    #skills?: Array<ActorSkill>;
    #stats?: Array<StatBonus>;

    constructor(name: string, hitDie: number, hitDieBonus: number, level: number) {
        this.#name = name;
        this.#hitDie = hitDie;
        this.#hitDieBonus = hitDieBonus;
        this.#level = level;
    }

    get kineticDamageReduction(): DamageReduction {
        return this.#kineticDamageReduction || new DamageReduction(0, 0, 0, 0);
    }

    set kineticDamageReduction(damageReduction: DamageReduction) {
        this.#kineticDamageReduction = damageReduction;
    }

    get energyDamageRedution(): DamageReduction {
        return this.#energyDamageReduction || new DamageReduction(0, 0, 0, 0);
    }

    set energyDamageReduction(damageReduction: DamageReduction) {
        this.#energyDamageReduction = damageReduction;
    }

    get skills(): Array<ActorSkill> {
        return this.#skills || new Array<ActorSkill>();
    }

    set skills(skills: Array<ActorSkill>) {
        this.skills = skills;
    }

    get stats(): Array<StatBonus> {
        return this.#stats || new Array<StatBonus>();
    }

    set stats(stats: Array<StatBonus>) {
        this.stats = stats;
    }

    get name(): string {
        return this.#name || '';
    }

    set name(value: string) {
        this.name = value;
    }

    get hitDie(): number {
        return this.#hitDie || 0;
    }

    set hitDie(value: number) {
        this.hitDie = value;
    }

    get hitDieBonus(): number {
        return this.#hitDieBonus || 0;
    }

    set hitDieBonus(value: number) {
        this.hitDieBonus = value;
    }

    get level(): number {
        return this.#level || 0;
    }

    set level(value: number) {
        this.level = value;
    }
}
