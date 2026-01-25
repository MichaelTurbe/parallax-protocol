import Actor from './actor.js';
import pc from 'picocolors';
import { SkillCategories } from './skill-category.js';

export default class Robot extends Actor {
    toJSON() {
        return {
            name: pc.green(this.name),
            damage: pc.red(this.level),
        };
    }

    public output() {
        console.log(pc.green('name:' + this.name));
        console.log(pc.red(String('level:' + this.level)));
        console.log(pc.red('SKILLS'));
        const skillsArrayString: Array<string> = new Array<string>();
        this.skills.forEach((actorSkill) => {
            if (actorSkill.skill.category !== SkillCategories.Martial) {
                skillsArrayString.push(
                    actorSkill.skill.name.toLowerCase() +
                        ': ' +
                        '+' +
                        actorSkill.totalSkillBonus +
                        '/' +
                        actorSkill.skillTarget
                );
            }
        });
        console.log(pc.yellow(String(skillsArrayString.join(', '))));
        this.attacks?.forEach((attack) => {
            console.log(
                pc.green(
                    'weapon:' +
                        attack.weapon.name +
                        ': +' +
                        attack.attackBonus +
                        '/' +
                        attack.attackTarget
                ),
                pc.red(
                    attack.weapon.damage.diceNumber +
                        attack.weapon.damage.dieType +
                        ' ' +
                        attack.weapon.primaryDamageType +
                        '(' +
                        attack.weapon.primarySubDamageType +
                        ')'
                )
            );
        });
        console.log(pc.red(String('damage reduction:' + this.energyDamageReduction.total)));
    }
}
