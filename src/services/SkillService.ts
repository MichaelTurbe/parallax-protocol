import { SkillCategories } from '../types/skill-category.ts';
import type { SkillName } from '../types/skill-name.ts';
import { SkillNames } from '../types/skill-name.ts';
import { Stats } from '../types/stat.ts';
import Skill from '../types/skill.ts';
import type { RobotRole } from '../types/robot-role.ts';
import { RobotRoles } from '../types/robot-role.ts';
import ActorSkill from '../types/actor-skill.ts';

export default class SkillService {
    #martialSkills: Array<Skill>;
    #intellectualSkills: Array<Skill>;
    #physicalSkills: Array<Skill>;
    #subtleSkills: Array<Skill>;
    #nameDictionary: Map<string, Skill> = new Map<string, Skill>();
    #RANGED_WEAPON_SKILLS_PLACEHOLDER: string = 'ranged weapons';

    constructor() {
        this.#martialSkills = this.#populateMartialSkills();
        this.#intellectualSkills = this.#populateIntellectualSkills();
        this.#physicalSkills = this.#populatePhysicalSkills();
        this.#subtleSkills = this.#populateSubtleSkills();
        this.populateSkillMap();
    }
    #populateMartialSkills(): Array<Skill> {
        const skills = new Array<Skill>();
        skills.push(new Skill(SkillNames.FirearmsHeavy, SkillCategories.Martial, Stats.STR));
        skills.push(new Skill(SkillNames.FirearmsLong, SkillCategories.Martial, Stats.WIS));
        skills.push(new Skill(SkillNames.FirearmsSmall, SkillCategories.Martial, Stats.DEX));
        skills.push(new Skill(SkillNames.MeleeWeapons, SkillCategories.Martial, Stats.STR));
        skills.push(new Skill(SkillNames.MartialArts, SkillCategories.Martial, Stats.DEX));
        skills.push(new Skill(SkillNames.Gunnery, SkillCategories.Martial, Stats.WIS));
        skills.push(new Skill(SkillNames.Grenades, SkillCategories.Martial, Stats.STR));
        return skills;
    }

    #populateIntellectualSkills(): Array<Skill> {
        const skills = new Array<Skill>();
        skills.push(new Skill(SkillNames.Astrogation, SkillCategories.Intellectual, Stats.INT));
        skills.push(new Skill(SkillNames.Chemistry, SkillCategories.Intellectual, Stats.INT));
        skills.push(new Skill(SkillNames.Computers, SkillCategories.Intellectual, Stats.INT));
        skills.push(new Skill(SkillNames.Cultures, SkillCategories.Intellectual, Stats.WIS));
        skills.push(new Skill(SkillNames.Engineering, SkillCategories.Intellectual, Stats.INT));
        skills.push(new Skill(SkillNames.Medicine, SkillCategories.Intellectual, Stats.WIS));
        skills.push(
            new Skill(SkillNames.StarshipPiloting, SkillCategories.Intellectual, Stats.WIS)
        );
        return skills;
    }

    #populatePhysicalSkills(): Array<Skill> {
        const skills = new Array<Skill>();
        skills.push(new Skill(SkillNames.Acrobatics, SkillCategories.Physical, Stats.DEX));
        skills.push(new Skill(SkillNames.AircraftPilot, SkillCategories.Physical, Stats.DEX));
        skills.push(new Skill(SkillNames.AnimalHandling, SkillCategories.Physical, Stats.WIS));
        skills.push(new Skill(SkillNames.Athletics, SkillCategories.Physical, Stats.STR));
        skills.push(new Skill(SkillNames.Deflection, SkillCategories.Physical, Stats.STR));
        skills.push(new Skill(SkillNames.GroundVehicles, SkillCategories.Physical, Stats.STR));
        skills.push(new Skill(SkillNames.Survival, SkillCategories.Physical, Stats.WIS));
        return skills;
    }

    #populateSubtleSkills(): Array<Skill> {
        const skills = new Array<Skill>();
        skills.push(new Skill(SkillNames.Awareness, SkillCategories.Physical, Stats.WIS));
        skills.push(new Skill(SkillNames.Bureaucracy, SkillCategories.Physical, Stats.CHA));
        skills.push(new Skill(SkillNames.Evasion, SkillCategories.Physical, Stats.DEX));
        skills.push(new Skill(SkillNames.Interrogation, SkillCategories.Physical, Stats.CHA));
        skills.push(new Skill(SkillNames.Stealth, SkillCategories.Physical, Stats.DEX));
        skills.push(new Skill(SkillNames.Streetsmarts, SkillCategories.Physical, Stats.CHA));
        skills.push(new Skill(SkillNames.Trading, SkillCategories.Physical, Stats.CHA));
        return skills;
    }

    get allMartialSkills(): Array<Skill> {
        return this.#martialSkills;
    }

    get allRangedWeaponSkills(): Array<Skill> {
        return this.allMartialSkills.filter((skill) => {
            return skill.name != SkillNames.MartialArts && skill.name != SkillNames.MeleeWeapons;
        });
    }

    get allIntellectuallSkills(): Array<Skill> {
        return this.#intellectualSkills;
    }

    get allPhysicallSkills(): Array<Skill> {
        return this.#physicalSkills;
    }

    get allSubtleSkills(): Array<Skill> {
        return this.#subtleSkills;
    }

    get allSkills(): Array<Skill> {
        return [
            ...this.#martialSkills,
            ...this.#intellectualSkills,
            ...this.#physicalSkills,
            ...this.#subtleSkills,
        ];
    }

    private populateSkillMap() {
        this.allSkills.forEach((skill) => {
            this.#nameDictionary.set(skill.name.toLowerCase(), skill);
        });
    }

    getSkillBySkillName(skillName: SkillName): Skill | null {
        // using the nullish coalescing operator
        // return whatever’s in the map — unless it’s undefined,
        // then return null.
        return this.#nameDictionary.get(skillName.toLowerCase()) ?? null;
    }

    getSkillByName(name: string): Skill | null {
        // using the nullish coalescing operator
        // return whatever’s in the map — unless it’s undefined,
        // then return null.
        return this.#nameDictionary.get(name.toLowerCase()) ?? null;
    }

    getSkillsForRobotRole(role: RobotRole, level: number): Array<ActorSkill> {
        const actorSkills = new Array<ActorSkill>();
        const skillPackage: Map<string, number> = this.getSkillPackageForRobotRole(role);
        for (const [key, value] of skillPackage) {
            if (key === this.#RANGED_WEAPON_SKILLS_PLACEHOLDER) {
                const rangedWeaponSkills = this.allRangedWeaponSkills;
                rangedWeaponSkills.forEach((skill) => {
                    const totalSkillBonus = level + value;
                    const actorSkill = new ActorSkill(
                        skill,
                        0,
                        20 - totalSkillBonus,
                        totalSkillBonus
                    );
                    actorSkills.push(actorSkill);
                });
            } else {
                const skill = this.getSkillByName(key);
                if (skill) {
                    const totalSkillBonus = level + value;
                    const actorSkill = new ActorSkill(
                        skill,
                        0,
                        20 - totalSkillBonus,
                        totalSkillBonus
                    );
                    actorSkills.push(actorSkill);
                }
            }
        }
        return actorSkills;
    }

    private getSkillPackageForRobotRole(role: RobotRole): Map<string, number> {
        let skillPackage: Map<string, number> = new Map<string, number>();
        switch (role) {
            case RobotRoles.Armored:
                skillPackage = new Map<string, number>([
                    ['melee weapons', 6],
                    [this.#RANGED_WEAPON_SKILLS_PLACEHOLDER, 5],
                    ['evasion', 3],
                    ['deflection', 6],
                    ['athletics', 6],
                    ['awareness', 1],
                    ['computers', 0],
                    ['engineering', 0],
                ]);
                break;
            case RobotRoles.Combat:
                skillPackage = new Map<string, number>([
                    ['melee weapons', 6],
                    [this.#RANGED_WEAPON_SKILLS_PLACEHOLDER, 5],
                    ['evasion', 2],
                    ['deflection', 5],
                    ['athletics', 5],
                    ['awareness', 2],
                    ['computers', 0],
                    ['engineering', 0],
                ]);
                break;
            case RobotRoles.Construction:
                skillPackage = new Map<string, number>([
                    ['melee weapons', 0],
                    [this.#RANGED_WEAPON_SKILLS_PLACEHOLDER, 1],
                    ['evasion', 2],
                    ['deflection', 1],
                    ['athletics', 0],
                    ['awareness', 2],
                    ['computers', 4],
                    ['engineering', 4],
                    ['ground vehicles', 3],
                    ['planetary survival', 4],
                ]);
                break;
            case RobotRoles.Infiltration:
                skillPackage = new Map<string, number>([
                    ['melee weapons', 3],
                    [this.#RANGED_WEAPON_SKILLS_PLACEHOLDER, 5],
                    ['evasion', 6],
                    ['deflection', 3],
                    ['acrobatics', 6],
                    ['athletics', 2],
                    ['awareness', 5],
                    ['stealth', 6],
                    ['computers', 2],
                    ['engineering', 2],
                ]);
                break;
            case RobotRoles.Governance:
                skillPackage = new Map<string, number>([
                    ['melee weapons', 0],
                    ['evasion', 4],
                    ['deflection', 1],
                    ['acrobatics', 1],
                    ['athletics', 0],
                    ['awareness', 4],
                    ['computers', 3],
                    ['engineering', 3],
                    ['trading', 6],
                    ['interrogation', 6],
                    ['cultures', 4],
                ]);
                break;
            case RobotRoles.Surgical:
                skillPackage = new Map<string, number>([
                    ['melee weapons', 0],
                    [this.#RANGED_WEAPON_SKILLS_PLACEHOLDER, 0],
                    ['evasion', 3],
                    ['deflection', 1],
                    ['athletics', 2],
                    ['awareness', 4],
                    ['computers', 6],
                    ['engineering', 6],
                    ['medicine', 5],
                ]);
                break;
            default:
                break;
        }
        return skillPackage;
    }
}
