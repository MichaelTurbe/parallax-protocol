import Actor from './actor.ts';
import pc from 'picocolors';
import { SkillCategories } from './skill-category.ts';

export default class Beast extends Actor {
    #singleSavingThrowTarget: number = 0;

    get singleSavingThrowTarget(): number {
        return this.#singleSavingThrowTarget;
    }

    set singleSavingThrowTarget(value: number) {
        this.#singleSavingThrowTarget = value;
    }

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
                )
            );
        });
        console.log(pc.red(String('damage reduction:' + this.energyDamageReduction.total)));
        console.log(
            pc.yellowBright(String(`single saving throw target: ${this.singleSavingThrowTarget} `))
        );
    }
}
