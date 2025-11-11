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

const robot1 = robotBuilderService.buildRobot(robotBuildParameters);
robot1.output();

const robotBuildParameters2 = new RobotBuildParameters(
    'Slicer',
    RobotRoles.Infiltration,
    3,
    DiceTypes.d8,
    ['none']
);

const robot2 = robotBuilderService.buildRobot(robotBuildParameters2);
robot2.output();

const robotBuildParameters3 = new RobotBuildParameters(
    'Boomer',
    RobotRoles.Armored,
    7,
    DiceTypes.d12,
    ['none']
);

const robot3 = robotBuilderService.buildRobot(robotBuildParameters3);
robot3.output();
