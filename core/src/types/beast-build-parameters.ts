import type { ActorSize } from './actor-size.js';
import type { DieType } from './die-type.js';
// import type { DieType } from './die-type.js';
import type { SkillCategory } from './skill-category.js';

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
