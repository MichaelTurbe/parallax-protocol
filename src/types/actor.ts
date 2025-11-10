import type ActorSkill from './actor-skill.ts';
import type Attack from './attack.ts';
import DamageReduction from './damage-reduction.ts';
import type DiceFormula from './dice-formula.ts';
import type StatBonus from './stat-bonus.ts';
import pc from 'picocolors';

export default class Actor {
    #name: string;
    #hitDie: DiceFormula;
    #level: number;
    #kineticDamageReduction?: DamageReduction;
    #energyDamageReduction?: DamageReduction;
    #skills?: Array<ActorSkill>;
    #stats?: Array<StatBonus>;
    #attacks?: Array<Attack>;

    constructor(name: string, hitDie: DiceFormula, level: number) {
        this.#name = name;
        this.#hitDie = hitDie;
        this.#level = level;
    }

    get kineticDamageReduction(): DamageReduction {
        return this.#kineticDamageReduction || new DamageReduction(0, 0, 0, 0);
    }

    set kineticDamageReduction(damageReduction: DamageReduction) {
        this.#kineticDamageReduction = damageReduction;
    }

    get energyDamageReduction(): DamageReduction {
        return this.#energyDamageReduction || new DamageReduction(0, 0, 0, 0);
    }

    set energyDamageReduction(damageReduction: DamageReduction) {
        this.#energyDamageReduction = damageReduction;
    }

    get skills(): Array<ActorSkill> {
        return this.#skills || new Array<ActorSkill>();
    }

    set skills(skills: Array<ActorSkill>) {
        this.#skills = skills;
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

    get hitDie(): DiceFormula {
        return this.#hitDie;
    }

    set hitDie(value: number) {
        this.hitDie = value;
    }

    get level(): number {
        return this.#level || 0;
    }

    set level(value: number) {
        this.level = value;
    }

    // --- Getter ---
    get attacks(): Array<Attack> | undefined {
        return this.#attacks;
    }

    // --- Setter ---
    set attacks(value: Array<Attack> | undefined) {
        this.#attacks = value;
    }

    toJSON() {
        return {
            name: pc.green(this.name),
            damage: pc.red(this.level),
        };
    }
}
