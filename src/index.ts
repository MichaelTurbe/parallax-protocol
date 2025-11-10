import DependencyService from './services/DependencyService.ts';
import { DiceTypes } from './types/die-type.ts';
import { RobotRoles } from './types/robot-role.ts';
import RobotBuildParameters from './types/robotBuildParameters.ts';
import pc from 'picocolors';

console.log(pc.bgBlack(pc.red('You built a robot:')));
const dependencyService = new DependencyService();
const robotBuilderService = dependencyService.robotBuilderService;
const robotBuildParameters = new RobotBuildParameters(
    'Clanker',
    RobotRoles.Combat,
    2,
    DiceTypes.d10,
    ['none']
);

const robot = robotBuilderService.buildRobot(robotBuildParameters);
robot.output();
