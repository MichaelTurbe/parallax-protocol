import Actor from './actor.ts';
import pc from 'picocolors';

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
            console.log(
                pc.yellow(String(actorSkill.skill.name)),
                pc.blue(String(`+` + actorSkill.totalSkillBonus))
            );
        });
    }
}
