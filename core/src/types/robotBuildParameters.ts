import type { DieType } from './die-type.js';
import type { RobotRole } from './robot-role.js';

export default class RobotBuildParameters {
    constructor(
        public name: string,
        public robotRole: RobotRole,
        public level: number,
        public hitDie: DieType,
        public weapons: Array<string>
    ) {}
}
