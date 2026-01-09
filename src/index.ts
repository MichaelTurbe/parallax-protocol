import BeastBuilderService from './services/BeastBuilderService.ts';
import DependencyService from './services/DependencyService.ts';
import BeastBuildParameters from './types/beast-build-parameters.ts';
// import { DiceTypes } from './types/die-type.ts';
// import { RobotRoles } from './types/robot-role.ts';
//import RobotBuildParameters from './types/robotBuildParameters.ts';
import pc from 'picocolors';
import { SkillCategories } from './types/skill-category.ts';
import { ActorSizes } from './types/actor-size.ts';

console.log(pc.bgBlack(pc.red('You built a robot:')));
const dependencyService = new DependencyService();
const beastBuilderService = new BeastBuilderService(
    dependencyService.skillService,
    dependencyService.weaponService
);
// const robotBuilderService = dependencyService.robotBuilderService;
// const robotBuildParameters = new RobotBuildParameters(
//     'Clanker',
//     RobotRoles.Combat,
//     1,
//     DiceTypes.d10,
//     ['Laser Pistol', 'Claws - Medium']
// );

// const robot1 = robotBuilderService.buildRobot(robotBuildParameters);
// robot1.output();

// const robotBuildParameters2 = new RobotBuildParameters(
//     'Slicer',
//     RobotRoles.Infiltration,
//     3,
//     DiceTypes.d8,
//     ['Gauss Rifle', 'Sword']
// );

// const robot2 = robotBuilderService.buildRobot(robotBuildParameters2);
// robot2.output();

// const robotBuildParameters3 = new RobotBuildParameters(
//     'Boomer',
//     RobotRoles.Armored,
//     7,
//     DiceTypes.d12,
//     ['Gauss Canon']
// );

// const robot3 = robotBuilderService.buildRobot(robotBuildParameters3);
// robot3.output();

// const robotBuildParameters4 = new RobotBuildParameters(
//     'Conversate',
//     RobotRoles.Governance,
//     4,
//     DiceTypes.d6,
//     ['Stun Pistol']
// );

// const robot4 = robotBuilderService.buildRobot(robotBuildParameters4);
// robot4.output();

// const robotBuildParameters5 = new RobotBuildParameters(
//     'Contructor',
//     RobotRoles.Construction,
//     3,
//     DiceTypes.d12,
//     ['Arc Pistol', 'Paws - Medium']
// );

// const robot5 = robotBuilderService.buildRobot(robotBuildParameters5);
// robot5.output();

// const robotBuildParameters6 = new RobotBuildParameters(
//     'Defender',
//     RobotRoles.Armored,
//     5,
//     DiceTypes.d12,
//     ['Gauss Rifle', 'Laser Rifle']
// );

// const robot6 = robotBuilderService.buildRobot(robotBuildParameters6);
// robot6.output();
// const robotBuildParameters6 = new RobotBuildParameters(
//     'Boomer',
//     RobotRoles.Combat,
//     7,
//     DiceTypes.d10,
//     ['Plasma Canon', 'Paws - Large']
// );

// const robot6 = robotBuilderService.buildRobot(robotBuildParameters6);
// robot6.output();

// const robotBuildParameters6 = new RobotBuildParameters(
//     'Medico',
//     RobotRoles.Surgical,
//     5,
//     DiceTypes.d6,
//     ['Stun Pistol']
// );

// const robot6 = robotBuilderService.buildRobot(robotBuildParameters6);
// robot6.output();

// const beastParams1 = new BeastBuildParameters(
//     'Cephlicon Trotter',
//     SkillCategories.Subtle,
//     1,
//     6,
//     ActorSizes.Medium,
//     1,
//     ['Claws - Medium', 'Jaws - Small']
// );

// const beast1 = beastBuilderService.buildBeast(beastParams1);
// beast1.output();

// const beastParams1 = new BeastBuildParameters(
//     'Crowspike',
//     SkillCategories.Martial,
//     2,
//     10,
//     ActorSizes.Large,
//     3,
//     ['Claws - Large', 'Jaws - Medium', 'Horns - Medium']
// );

// const beast1 = beastBuilderService.buildBeast(beastParams1);
// beast1.output();
