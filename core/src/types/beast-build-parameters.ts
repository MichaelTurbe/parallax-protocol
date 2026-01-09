import type { ActorSize } from './actor-size.ts';
import type { DieType } from './die-type.ts';
// import type { DieType } from './die-type.ts';
import type { SkillCategory } from './skill-category.ts';

export default class {
    constructor(
        public name: string,
        public role: SkillCategory,
        public level: number,
        public hitDie: DieType,
        public size: ActorSize,
        public damageReduction: number,
        public weapons: Array<string>
    ) {}
}
