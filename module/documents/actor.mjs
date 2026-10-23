import { PARALLAX } from "../config.mjs";

const STATBLOCK_CORE_SKILLS = ["awareness", "deflection", "evasion"];

export class ParallaxActor extends Actor {
    prepareBaseData() {
        super.prepareBaseData();

        const system = this.system;

        if (["npc", "robot", "creature"].includes(this.type)) {
            system.skills ??= {};
            system.summary ??= {};
            system.defenses ??= {};

            for (const skillKey of STATBLOCK_CORE_SKILLS) {
                const configSkill = PARALLAX.skills[skillKey];
                system.skills[skillKey] ??= {};
                system.skills[skillKey].label ??= configSkill?.label ?? skillKey;
                system.skills[skillKey].bonus ??= 0;
                system.skills[skillKey].target ??= 20;
                system.skills[skillKey].isCore ??= true;
            }
            return;
        }

        if (this.type !== "character") return;

        system.skills ??= {};
        system.saves ??= {};

        for (const [key, skill] of Object.entries(PARALLAX.skills)) {
            system.skills[key] ??= {};
            system.skills[key].label ??= skill.label;
            system.skills[key].category ??= skill.category;
            system.skills[key].stat ??= skill.stat;
            // Falls back to the pre-0.1.0 trainedSkillBonus for actors the world migration hasn't reached
            // (e.g. characters imported from an old compendium).
            system.skills[key].rank ??= Number(system.skills[key].trainedSkillBonus ?? 0);
            system.skills[key].itemBonus ??= 0;
            system.skills[key].totalBonus ??= 0;
            system.skills[key].target ??= 20;
        }

        for (const [key, label] of Object.entries(PARALLAX.saveTypes)) {
            system.saves[key] ??= {};
            system.saves[key].label ??= label;
            system.saves[key].hereditaryBonus ??= 0;
            system.saves[key].itemBonus ??= 0;
            system.saves[key].target ??= 20;
        }
    }

    prepareDerivedData() {
        super.prepareDerivedData();

        if (["npc", "robot", "creature"].includes(this.type)) {
            this._prepareStatblockData();
            return;
        }

        if (this.type !== "character") return;

        const rawLevel = Number(this.system?.identity?.level || 1);
        const level = Math.max(1, Math.min(14, Number.isFinite(rawLevel) ? rawLevel : 1));

        this._prepareItemsAndArmor();
        this._prepareSkills();
        this._prepareRankBudget(level);
        this._prepareSaves(level);
        this._prepareCombat();
        this._prepareLoad();
        this._prepareMovement();
        this._prepareDr();
    }

    _prepareStatblockData() {
        const skills = this.system.skills ?? {};

        for (const skill of Object.values(skills)) {
            const bonus = Number(skill?.bonus ?? 0);
            skill.target = 20 - bonus;
        }

        const awareness = Number(skills.awareness?.bonus ?? 0);
        const deflection = Number(skills.deflection?.bonus ?? 0);
        const evasion = Number(skills.evasion?.bonus ?? 0);

        this.system.defenses.evasion = evasion;
        this.system.defenses.deflection = deflection;
        this.system.defenses.initiativeBonus = awareness;
    }

    _prepareSkills() {
        // Armor and field DEX penalties lower the DEX bonus used by DEX-based skills (rulebook p. 70).
        const dexPenalty = Number(this.system.armorSummary?.dexPenalty ?? 0);

        for (const skill of Object.values(this.system.skills ?? {})) {
            const statPenalty = skill.stat === "dex" ? dexPenalty : 0;
            const statBonus = Number(this.system.stats?.[skill.stat]?.value ?? 0) - statPenalty;
            const rank = Number(skill.rank ?? 0);
            const itemBonus = Number(skill.itemBonus ?? 0);

            skill.trained = rank > 0;
            skill.totalBonus = statBonus + rank + itemBonus;
            skill.target = 20 - skill.totalBonus;
        }
    }

    // Ranks each category may hold: its creation budget plus one rank per advance for every level after 1st.
    // These are guidance for the sheet only; nothing prevents going over.
    _prepareRankBudget(level) {
        const rankBudget = {};

        for (const category of Object.keys(PARALLAX.skillCategories)) {
            const priority = PARALLAX.priorityRanks.find((rank) => this.system.priorities?.[rank] === category) ?? null;
            const rules = PARALLAX.priorityRules[priority] ?? { creationRanks: 0, creationMax: 0, advancesPerLevel: 0 };
            const allowance = rules.creationRanks + (level - 1) * rules.advancesPerLevel;
            let spent = 0;

            for (const skill of Object.values(this.system.skills ?? {})) {
                if (skill.category !== category) continue;
                const rank = Number(skill.rank ?? 0);
                spent += rank;
                skill.overCreationMax = level === 1 && rank > rules.creationMax;
                skill.creationMax = rules.creationMax;
            }

            rankBudget[category] = {
                priority,
                priorityLabel: PARALLAX.priorityLabels[priority] ?? "Unranked",
                creationRanks: rules.creationRanks,
                creationMax: rules.creationMax,
                advancesPerLevel: rules.advancesPerLevel,
                allowance,
                spent,
                remaining: allowance - spent,
                status: spent < allowance ? "under" : spent > allowance ? "over" : "full",
            };
        }

        this.system.rankBudget = rankBudget;
    }

    _prepareSaves(level) {
        const conBonus = Number(this.system?.stats?.con?.value ?? 0);

        for (const save of Object.values(this.system.saves ?? {})) {
            const hereditaryBonus = Number(save.hereditaryBonus ?? 0);
            const itemBonus = Number(save.itemBonus ?? 0);
            const armorBonus = Number(save.armorBonus ?? 0);
            save.target = 20 - conBonus - level - hereditaryBonus - itemBonus - armorBonus;
        }
    }

    _prepareItemsAndArmor() {
        let armorItem = null;
        let fieldItem = null;
        let shieldItem = null;
        let speciesKinetic = 0;
        let speciesEnergy = 0;
        const speciesSaveBonuses = {};

        for (const item of this.items) {
            if (item.type === "armor" && !armorItem) armorItem = item;
            if (item.type === "field" && !fieldItem) fieldItem = item;
            if (item.type === "shield" && !shieldItem) shieldItem = item;
            if (item.type === "speciesTrait") {
                speciesKinetic += Number(item.system.hereditaryArmorKinetic ?? 0);
                speciesEnergy += Number(item.system.hereditaryArmorEnergy ?? 0);
                for (const [key, value] of Object.entries(item.system.saveBonuses ?? {})) {
                    speciesSaveBonuses[key] = Number(speciesSaveBonuses[key] ?? 0) + Number(value ?? 0);
                }
            }
        }

        this.system.armorSummary.type = armorItem?.name ?? "";
        this.system.armorSummary.dexPenalty = Number(armorItem?.system.dexPenalty ?? 0) + Number(fieldItem?.system.dexPenalty ?? 0);
        this.system.armorSummary.armor.kinetic = Number(armorItem?.system.kineticDr ?? 0);
        this.system.armorSummary.armor.energy = Number(armorItem?.system.energyDr ?? 0);
        this.system.armorSummary.field.kinetic = Number(fieldItem?.system.kineticDr ?? 0);
        this.system.armorSummary.field.energy = Number(fieldItem?.system.energyDr ?? 0);
        this.system.armorSummary.shield.kinetic = Number(shieldItem?.system.kineticDr ?? 0);
        this.system.armorSummary.shield.energy = 0;
        this.system.armorSummary.body.kinetic = speciesKinetic;
        this.system.armorSummary.body.energy = speciesEnergy;
        this.system.movement.armorPenalty = Number(armorItem?.system.speedPenalty ?? 0) + Number(fieldItem?.system.speedPenalty ?? 0);

        const equippedSaveBonuses = {
            radiation: Number(armorItem?.system.saveBonuses?.radiation ?? 0) + Number(fieldItem?.system.saveBonuses?.radiation ?? 0),
            stun: Number(armorItem?.system.saveBonuses?.stun ?? 0) + Number(fieldItem?.system.saveBonuses?.stun ?? 0),
        };

        for (const [saveKey, save] of Object.entries(this.system.saves ?? {})) {
            save.hereditaryBonus = Number(speciesSaveBonuses[saveKey] ?? save.hereditaryBonus ?? 0);
            save.armorBonus = Number(equippedSaveBonuses[saveKey] ?? 0);
        }
    }

    _prepareCombat() {
        const awareness = this.system?.skills?.awareness ?? { totalBonus: 0, target: 20 };
        const deflection = this.system?.skills?.deflection ?? { totalBonus: 0, target: 20 };
        const evasion = this.system?.skills?.evasion ?? { totalBonus: 0, target: 20 };

        this.system.combat.awareness.totalBonus = awareness.totalBonus;
        this.system.combat.awareness.target = awareness.target;
        this.system.combat.deflection.totalBonus = deflection.totalBonus;
        this.system.combat.deflection.target = deflection.target;
        this.system.combat.evasion.totalBonus = evasion.totalBonus;
        this.system.combat.evasion.target = evasion.target;
        this.system.combat.initiativeBonus = awareness.totalBonus;
    }

    _prepareLoad() {
        let equipmentBulkInPack = 0;
        let equipmentBulkNotInPack = 0;

        for (const item of this.items) {
            if (item.type === "gear") {
                const bulk = Number(item.system.bulk ?? 0);
                if (item.system.inPack) equipmentBulkInPack += bulk;
                else equipmentBulkNotInPack += bulk;
            }

            if (["weapon", "armor", "field", "shield"].includes(item.type)) {
                equipmentBulkNotInPack += Number(item.system.bulk ?? 0);
            }
        }

        this.system.load.equipmentBulkInPack = equipmentBulkInPack;
        this.system.load.equipmentBulkNotInPack = equipmentBulkNotInPack;
        this.system.load.totalBulkWithoutPack = equipmentBulkNotInPack;
        this.system.load.totalBulkWithPack = equipmentBulkInPack + equipmentBulkNotInPack;
        this.system.load.rating = 5 + Number(this.system?.stats?.str?.value ?? 0);
    }

    // BURDENED: speed drops 5 ft for every point of bulk above the load rating, until unable to move.
    // Fractional bulk over the rating rounds up to a full point.
    _prepareMovement() {
        const base = Number(this.system.movement.base ?? 30);
        const armorPenalty = Number(this.system.movement.armorPenalty ?? 0);
        const rating = Number(this.system.load.rating ?? 0);
        const burdenedPenalty = (bulk) => 5 * Math.max(0, Math.ceil(Number(bulk ?? 0) - rating));
        const withPackPenalty = burdenedPenalty(this.system.load.totalBulkWithPack);
        const withoutPackPenalty = burdenedPenalty(this.system.load.totalBulkWithoutPack);

        this.system.movement.burdenedPenaltyWithPack = withPackPenalty;
        this.system.movement.burdenedPenaltyWithoutPack = withoutPackPenalty;
        this.system.load.burdenedWithPack = withPackPenalty > 0;
        this.system.load.burdenedWithoutPack = withoutPackPenalty > 0;

        this.system.movement.totalWithPack = Math.max(0, base - armorPenalty - withPackPenalty);
        this.system.movement.totalWithoutPack = Math.max(0, base - armorPenalty - withoutPackPenalty);
    }

    _prepareDr() {
        this.system.armorSummary.total.kinetic =
            Number(this.system.armorSummary.body.kinetic ?? 0) +
            Number(this.system.armorSummary.armor.kinetic ?? 0) +
            Number(this.system.armorSummary.field.kinetic ?? 0) +
            Number(this.system.armorSummary.shield.kinetic ?? 0);

        this.system.armorSummary.total.energy =
            Number(this.system.armorSummary.body.energy ?? 0) +
            Number(this.system.armorSummary.armor.energy ?? 0) +
            Number(this.system.armorSummary.field.energy ?? 0) +
            Number(this.system.armorSummary.shield.energy ?? 0);
    }
}
