import type { DieType } from './die-type.ts';
import type { RobotRole } from './robot-role.ts';

export default class RobotBuildParameters {
    constructor(
        public name: string,
        public robotRole: RobotRole,
        public level: number,
        public hitDie: DieType,
        public weapons: Array<string>
    ) {}
}
