import { SkillCategories } from '../types/skill-category.ts';
import { SkillNames } from '../types/skill-name.ts';
import { Stats } from '../types/stat.ts';
import Skill from '../types/skill.ts';

export default class SkillService {
    #martialSkills: Array<Skill>;
    #intellectualSkills: Array<Skill>;
    #physicalSkills: Array<Skill>;
    #subtleSkills: Array<Skill>;

    constructor() {
        this.#martialSkills = this.#populateMartialSkills();
        this.#intellectualSkills = this.#populateIntellectualSkills();
        this.#physicalSkills = this.#populatePhysicalSkills();
        this.#subtleSkills = this.#populateSubtleSkills();
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

    get getAllMartialSkills(): Array<Skill> {
        return this.#martialSkills;
    }

    get getAllIntellectuallSkills(): Array<Skill> {
        return this.#intellectualSkills;
    }

    get getAllPhysicallSkills(): Array<Skill> {
        return this.#physicalSkills;
    }

    get getAllSubtleSkills(): Array<Skill> {
        return this.#subtleSkills;
    }

    get getAllSkills(): Array<Skill> {
        return [
            ...this.#martialSkills,
            ...this.#intellectualSkills,
            ...this.#physicalSkills,
            ...this.#subtleSkills,
        ];
    }
}
