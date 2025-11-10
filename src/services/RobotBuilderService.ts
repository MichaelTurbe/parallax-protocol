import DamageReduction from '../types/damage-reduction.ts';
import DiceFormula from '../types/dice-formula.ts';
import type { DieType } from '../types/die-type.ts';
import { DiceTypes } from '../types/die-type.ts';
import { RobotRoles } from '../types/robot-role.ts';
import Robot from '../types/robot.ts';
import type RobotBuildParameters from '../types/robotBuildParameters.ts';
import type SkillService from './SkillService.ts';
import type WeaponsService from './WeaponsService.ts';

export default class RobotBuilderService {
    constructor(
        private SkillService: SkillService,
        private WeaponsService: WeaponsService
    ) {}

    buildRobot(params: RobotBuildParameters): Robot {
        const robot = new Robot(params.name, this.getHitDie(params), params.level);
        const overallDR = this.getDamageReduction(params);
        robot.kineticDamageReduction = overallDR;
        robot.energyDamageReduction = overallDR;
        robot.skills = this.SkillService.getSkillsForRobotRole(params.robotRole, params.level);
        return robot;
    }

    // private buildAttacks(params: RobotBuildParameters): Array<Attack> {
    //     const attacks = new Array<Attack>();
    //     params.weapons.forEach(weaponName => {
    //         const weapon = this.WeaponsService.getWeaponByName('Gauss Rifle');
    //         const attack = new Attack()
    //     })
    // }

    private getHitDie(params: RobotBuildParameters): DiceFormula {
        let dieType: DieType;
        switch (params.robotRole) {
            case RobotRoles.Armored:
                dieType = DiceTypes.d12;
                break;
            case RobotRoles.Combat:
                dieType = DiceTypes.d10;
                break;
            case RobotRoles.Construction:
                dieType = DiceTypes.d12;
                break;
            case RobotRoles.Governance:
                dieType = DiceTypes.d6;
                break;
            case RobotRoles.Infiltration:
                dieType = DiceTypes.d8;
                break;
            default:
                dieType = DiceTypes.d8;
                break;
        }
        const hitDie = new DiceFormula(dieType, params.level, 0);
        return hitDie;
    }

    private getArmoredDR(params: RobotBuildParameters) {
        let overallDR = 0;
        const level = params.level;
        switch (level) {
            case 1:
            case 2:
                overallDR = 3;
                break;
            case 3:
            case 4:
                overallDR = 4;
                break;
            case 5:
            case 6:
                overallDR = 5;
                break;
            case 7:
            case 8:
                overallDR = 6;
                break;
            case 9:
            case 10:
                overallDR = 7;
                break;
            case 11:
            case 12:
                overallDR = 8;
                break;
            case 13:
            case 14:
                overallDR = 9;
                break;
            default:
                break;
        }
        return overallDR;
    }

    private getCombatDR(params: RobotBuildParameters) {
        let overallDR = 0;
        const level = params.level;
        switch (level) {
            case 1:
            case 2:
                overallDR = 1;
                break;
            case 3:
            case 4:
                overallDR = 2;
                break;
            case 5:
            case 6:
                overallDR = 3;
                break;
            case 7:
            case 8:
                overallDR = 4;
                break;
            case 9:
            case 10:
                overallDR = 5;
                break;
            case 11:
            case 12:
                overallDR = 6;
                break;
            case 13:
            case 14:
                overallDR = 7;
                break;
            default:
                break;
        }
        return overallDR;
    }

    private getDamageReduction(params: RobotBuildParameters): DamageReduction {
        let overallDR = 0;
        switch (params.robotRole) {
            case RobotRoles.Armored:
                overallDR = this.getArmoredDR(params);
                break;
            case RobotRoles.Combat:
                overallDR = this.getCombatDR(params);
                break;
            default:
                overallDR = 1;
                break;
        }
        const damageReduction = new DamageReduction(0, 0, 0, overallDR);
        return damageReduction;
    }

    // private getSkills(params: RobotBuildParameters): Array<ActorSkill> {
    //     const skillPackage = this.SkillService.getSkillPackageForRobotRole(params.robotRole);
    //     for (const [key, value] of skillPackage) {
    //         console.log(`${key} = ${value}`);
    //     }
    // }
}
