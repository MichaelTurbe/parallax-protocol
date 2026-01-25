import Attack from '../types/attack.js';
import type BeastBuildParameters from '../types/beast-build-parameters.js';
import Beast from '../types/beast.js';
import DamageReduction from '../types/damage-reduction.js';
import DiceFormula from '../types/dice-formula.js';
import type { DieType } from '../types/die-type.js';
import { DiceTypes } from '../types/die-type.js';
import { SkillCategories } from '../types/skill-category.js';
import type SkillService from './SkillService.js';
import type WeaponsService from './WeaponsService.js';

export default class BeastBuilderService {
    constructor(
        private SkillService: SkillService,
        private WeaponsService: WeaponsService
    ) {}

    buildBeast(params: BeastBuildParameters) {
        const beast = new Beast(params.name, this.getHitDie(params), params.level);
        const overallDR = this.getDamageReduction(params);
        beast.kineticDamageReduction = overallDR;
        beast.energyDamageReduction = overallDR;
        beast.skills = this.SkillService.getSkillsForBeastCategory(params.role, params.level);
        beast.attacks = this.buildAttacks(params, beast);
        beast.singleSavingThrowTarget = 20 - params.level - 2;
        return beast;
    }

    private getDamageReduction(params: BeastBuildParameters): DamageReduction {
        const damageReduction = new DamageReduction(0, 0, 0, params.damageReduction);
        return damageReduction;
    }

    private getHitDie(params: BeastBuildParameters): DiceFormula {
        const dieType: DieType = params.hitDie;
        const hitDie = new DiceFormula(dieType, params.level, 0);

        return hitDie;
    }

    private buildAttacks(params: BeastBuildParameters, beast: Beast): Array<Attack> {
        const attacks = new Array<Attack>();
        params.weapons.forEach((weaponName) => {
            const weapon = this.WeaponsService.getWeaponByName(weaponName);
            if (weapon) {
                const associatedSkill = weapon.associatedSkill;
                if (associatedSkill) {
                    const actorSkill = beast.skills.find(
                        (item) => item.skill.name === associatedSkill.name
                    );
                    if (actorSkill) {
                        const attack = new Attack(
                            weapon,
                            actorSkill,
                            actorSkill?.totalSkillBonus,
                            actorSkill?.skillTarget
                        );
                        attacks.push(attack);
                    } else {
                        console.log(
                            'the actor did not have a skill that matched the desired weapon skill'
                        );
                    }
                } else {
                    console.log('could not find the skill for this weapon');
                }
            } else {
                console.log('could not locate weapon called ', weaponName);
            }
        });
        return attacks;
    }
}
