import Actor from './actor.ts';
import pc from 'picocolors';
import { SkillCategories } from './skill-category.ts';

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
        this.skills.forEach((actorSkill) => {
            if (actorSkill.skill.category !== SkillCategories.Martial) {
                console.log(
                    pc.yellow(String(actorSkill.skill.name)),
                    pc.blue(String(`+` + actorSkill.totalSkillBonus))
                );
            }
        });
        console.log(pc.red(String('damage reduction:' + this.energyDamageReduction.total)));
    }
}
