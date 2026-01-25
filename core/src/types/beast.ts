import Actor from './actor.ts';
import pc from 'picocolors';
import { SkillCategories } from './skill-category.ts';

export default class Beast extends Actor {
  singleSavingThrowTarget: number;

  constructor(...args: ConstructorParameters<typeof Actor>) {
    super(...args);
    this.singleSavingThrowTarget = 0;
  }

  toJSON() {
    return {
      name: pc.green(this.name),
      damage: pc.red(this.level),
    };
  }

  output() {
    console.log(pc.green('name:' + this.name));
    console.log(pc.red('level:' + String(this.level)));

    console.log(pc.red('SKILLS'));
    const skillsArrayString: Array<string> = [];

    this.skills.forEach((actorSkill) => {
      if (actorSkill.skill.category !== SkillCategories.Martial) {
        skillsArrayString.push(
          actorSkill.skill.name.toLowerCase() +
            ': +' +
            actorSkill.totalSkillBonus +
            '/' +
            actorSkill.skillTarget
        );
      }
    });

    console.log(pc.yellow(skillsArrayString.join(', ')));

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

    console.log(
      pc.red('damage reduction:' + this.energyDamageReduction.total)
    );

    console.log(
      pc.yellowBright(`single saving throw target: ${this.singleSavingThrowTarget}`)
    );
  }
}
