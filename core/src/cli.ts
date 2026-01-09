#!/usr/bin/env node
import pc from 'picocolors';
import {
    intro,
    outro,
    select,
    // multiselect,
    // confirm,
    text,
    // spinner,
    isCancel,
    cancel,
    confirm,
} from '@clack/prompts';
import DependencyService from './services/DependencyService.ts';
import BeastBuilderService from './services/BeastBuilderService.ts';
import BeastBuildParameters from './types/beast-build-parameters.ts';
import { BuilderTypes, type BuilderType } from './types/builder-type.ts';
import type { SkillCategory } from './types/skill-category.ts';
import { SkillCategories } from './types/skill-category.ts';
import { DiceTypes, type DieType } from './types/die-type.ts';
import type DiceFormula from './types/dice-formula.ts';
import type { ActorSize } from './types/actor-size.ts';
import { ActorSizes } from './types/actor-size.ts';
import Attack from './types/attack.ts';
import type { WeaponType } from './types/weapon-type.ts';
import { WeaponTypes } from './types/weapon-type.ts';
import WeaponsService from './services/WeaponsService.ts';
import type Weapon from './types/weapon.ts';
import type { RobotRole } from './types/robot-role.ts';
import { RobotRoles } from './types/robot-role.ts';
import RobotBuilderService from './services/RobotBuilderService.ts';
import RobotBuildParameters from './types/robotBuildParameters.ts';
import FoundryActorService from './services/FoundryActorService.ts';
const dependencyService: DependencyService = new DependencyService();
const beastBuilderService: BeastBuilderService = new BeastBuilderService(
    dependencyService.skillService,
    dependencyService.weaponService
);
const robotBuilderService = new RobotBuilderService(
    dependencyService.skillService,
    dependencyService.weaponService
);

async function main() {
    intro(pc.cyan('🚀 Parallax Protocol Command Line tools'));

    const builderType = await getBuilderType();
    if (builderType === BuilderTypes.Beast) {
        await buildBeast(beastBuilderService);
    } else if (builderType === BuilderTypes.Robot) {
        await buildRobot();
    }
    outro(`You're all set!`);
}

async function buildRobot() {
    const actorType = 'robot';
    const name = await getActorName(actorType);
    const role = await getRobotRole();
    const level = (await getLevel(actorType)) ?? 0;
    const hitDie = await getHitDieType(actorType);
    const size = await getSize(actorType);
    // const dr = (await getDamageReduction(actorType)) ?? 0;
    const attacks = new Array<string>();
    await addWeapons(actorType, attacks);
    const params = new RobotBuildParameters(name, role, level, hitDie, attacks);
    const robot = robotBuilderService.buildRobot(params);
    const foundryActorService: FoundryActorService = new FoundryActorService(robot);
    await foundryActorService.outputJson();
    // robot.output();
}

async function buildBeast(beastBuilderService: BeastBuilderService) {
    const actorType = 'beast';
    const name = await getActorName(actorType);
    const role = await getBeastRole();
    const level = (await getLevel(actorType)) ?? 0;
    const hitDie = await getHitDieType(actorType);
    const size = await getSize(actorType);
    const dr = (await getDamageReduction(actorType)) ?? 0;
    const attacks = new Array<string>();
    await addWeapons(actorType, attacks);
    const params = new BeastBuildParameters(name, role, level, hitDie, size, dr, attacks);
    const beast = beastBuilderService.buildBeast(params);
    const foundryActorService: FoundryActorService = new FoundryActorService(beast);
    await foundryActorService.outputJson();
    // beast.output();
}

async function addWeapons(actorType: string, attacks: Array<string>) {
    const message = `Would you like to add an attack to your ${actorType}?`;
    const add = await getConfirmation(message);
    if (add) {
        // go do the thing with lists of weapons
        const weaponType = await getWeaponTypes();
        if (weaponType === WeaponTypes.Natural) {
            const weapon = await getNaturalWeapon(actorType);
            attacks.push(weapon.name);
            return await addWeapons(actorType, attacks);
        } else {
            const weapon = await getManufacturedlWeapon(actorType);
            attacks.push(weapon.name);
            return await addWeapons(actorType, attacks);
        }
    } else {
        return;
    }
}

async function getNaturalWeapon(actorType: string): Promise<Weapon> {
    const values = Object.values(
        dependencyService.weaponService.allNaturalWeapons
    ) as Array<Weapon>;
    const value = await select({
        message: `Which type of natural weapon does your ${actorType} have?`,
        options: values.map((t) => ({
            label: t.name, // what the user sees
            value: t, // what you get back
        })),
    });
    if (isCancel(value)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return value as Weapon;
}

async function getManufacturedlWeapon(actorType: string): Promise<Weapon> {
    const values = Object.values(dependencyService.weaponService.allWeapons) as Array<Weapon>;
    const value = await select({
        message: `Which type of weapon does your ${actorType} have?`,
        options: values.map((t) => ({
            label: t.name, // what the user sees
            value: t, // what you get back
        })),
    });
    if (isCancel(value)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return value as Weapon;
}

async function getWeaponTypes(): Promise<WeaponType> {
    // Object.values(BuilderTypes) →
    // But TypeScript widens that to string[], so for strong typing, you assert it back to your union type:
    const values = Object.values(WeaponTypes) as Array<WeaponType>;
    const value = await select({
        message: 'What type of weapon do you want to add?',
        options: values.map((t) => ({
            label: t, // what the user sees
            value: t, // what you get back
        })),
    });
    if (isCancel(value)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return value as WeaponType;
}

async function getBeastRole(): Promise<SkillCategory> {
    const values = Object.values(SkillCategories) as Array<SkillCategory>;
    const value = await select({
        message: 'What role does this beast most closely match?',
        options: values.map((t) => ({
            label: t, // what the user sees
            value: t, // what you get back
        })),
    });
    if (isCancel(value)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return value as SkillCategory;
}

async function getRobotRole(): Promise<RobotRole> {
    const values = Object.values(RobotRoles) as Array<RobotRole>;
    const value = await select({
        message: 'What role does this robot fulfill?',
        options: values.map((t) => ({
            label: t, // what the user sees
            value: t, // what you get back
        })),
    });
    if (isCancel(value)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return value as RobotRole;
}

async function getConfirmation(message: string) {
    const value = await confirm({
        message: message,
    });
    if (isCancel(value)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return value;
}

// async function getHitDie(actorType: string): Promise<number | null> {
//     let numberValue: number | null = 0;
//     const value = await text({
//         message: `What should your ${actorType}'s hit die be?`,
//         validate(value: string) {
//             const number = toNumber(value);
//             if (!number) return `Level must be a number!`;
//         },
//     });
//     if (isCancel(value)) {
//         cancel('Operation cancelled.');
//         process.exit(0);
//     }
//     numberValue = toNumber(value);
//     return numberValue;
// }
async function getHitDieType(actorType: string): Promise<DieType> {
    const hitDieTypeValues = Object.values(DiceTypes) as Array<DieType>;
    const hitDieType = await select({
        message: `Pick a hit die for your ${actorType}.`,
        options: hitDieTypeValues.map((t) => ({
            label: t, // what the user sees
            value: t, // what you get back
        })),
    });
    if (isCancel(hitDieType)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return hitDieType as DieType;
}

async function getSize(actorType: string): Promise<ActorSize> {
    const actorSizeValues = Object.values(ActorSizes) as Array<ActorSize>;
    const actorSize = await select({
        message: `How large is your ${actorType}?`,
        options: actorSizeValues.map((t) => ({
            label: t, // what the user sees
            value: t, // what you get back
        })),
    });
    if (isCancel(actorSize)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return actorSize as ActorSize;
}

async function getLevel(actorType: string): Promise<number | null> {
    let numberValue: number | null = 0;
    const value = await text({
        message: `What level will your ${actorType} be?`,
        validate(value: string) {
            const number = toNumber(value);
            if (!number) return `Level must be a number!`;
        },
    });
    if (isCancel(value)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    numberValue = toNumber(value);
    return numberValue;
}

async function getDamageReduction(actorType: string): Promise<number | null> {
    let numberValue: number | null = 0;
    const value = await text({
        message: `What level of damage reduction will your ${actorType} have (normally anywhere from 0 to 3)?`,
        validate(value: string) {
            const number = toNumber(value);
            if (!number) return `Level must be a number!`;
        },
    });
    if (isCancel(value)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    numberValue = toNumber(value);
    return numberValue;
}

function toNumber(value: string): number | null {
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
}

async function getActorName(actorType: string): Promise<string> {
    const name = await text({
        message: `What would you like your ${actorType} to be named?`,
        validate(value: string) {
            if (value.length === 0) return `Name is required!`;
        },
    });
    if (isCancel(name)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return name;
}

async function getBuilderType(): Promise<BuilderType> {
    // Object.values(BuilderTypes) →
    // But TypeScript widens that to string[], so for strong typing, you assert it back to your union type:
    const builderTypeValues = Object.values(BuilderTypes) as Array<BuilderType>;
    const builderType = await select({
        message: 'Pick a type of actor to create.',
        options: builderTypeValues.map((t) => ({
            label: t, // what the user sees
            value: t, // what you get back
        })),
    });
    if (isCancel(builderType)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return builderType as BuilderType;
}

main().catch((err) => {
    console.error(pc.red(err instanceof Error ? (err.stack ?? err.message) : String(err)));
    process.exit(1);
});
