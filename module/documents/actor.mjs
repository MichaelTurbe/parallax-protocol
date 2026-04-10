import { PARALLAX } from "../config.mjs";

export class ParallaxActor extends Actor {
    prepareBaseData() {
        super.prepareBaseData();

        if (this.type !== "character") return;

        const system = this.system;

        system.skills ??= {};
        system.saves ??= {};

        for (const [key, skill] of Object.entries(PARALLAX.skills)) {
            system.skills[key] ??= {};
            system.skills[key].label ??= skill.label;
            system.skills[key].category ??= skill.category;
            system.skills[key].stat ??= skill.stat;
            system.skills[key].trained ??= false;
            system.skills[key].itemBonus ??= 0;
            system.skills[key].totalBonus ??= 0;
            system.skills[key].target ??= 20;
            system.skills[key].frozenTrainedBonus ??= null;
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

        if (this.type !== "character") return;

        const rawLevel = Number(this.system?.identity?.level || 1);
        const level = Math.max(1, Math.min(14, Number.isFinite(rawLevel) ? rawLevel : 1));

        this._preparePriorityBonuses(level);
        this._prepareSkills();
        this._prepareSaves(level);
        this._prepareItemsAndArmor();
        this._prepareCombat();
        this._prepareLoad();
        this._prepareMovement();
        this._prepareDr();
    }

    _preparePriorityBonuses(level) {
        const table = PARALLAX.trainedSkillBonusByLevel[level];
        const priorities = this.system.priorities;

        const bonuses = {
            martial: 0,
            intellectual: 0,
            physical: 0,
            subtle: 0,
        };

        bonuses[priorities.first] = table.first;
        bonuses[priorities.second] = table.second;
        bonuses[priorities.third] = table.third;
        bonuses[priorities.fourth] = table.fourth;

        this.system.trainedSkillBonuses.martial = bonuses.martial;
        this.system.trainedSkillBonuses.intellectual = bonuses.intellectual;
        this.system.trainedSkillBonuses.physical = bonuses.physical;
        this.system.trainedSkillBonuses.subtle = bonuses.subtle;
    }

    _prepareSkills() {
        for (const skill of Object.values(this.system.skills ?? {})) {
            const statBonus = Number(this.system.stats?.[skill.stat]?.value ?? 0);
            const itemBonus = Number(skill.itemBonus ?? 0);

            let trainedSkillBonus = 0;
            if (skill.trained) {
                if (Number.isInteger(skill.frozenTrainedBonus)) {
                    trainedSkillBonus = Number(skill.frozenTrainedBonus);
                } else {
                    trainedSkillBonus = Number(this.system.trainedSkillBonuses?.[skill.category] ?? 0);
                }
            }

            skill.totalBonus = statBonus + trainedSkillBonus + itemBonus;
            skill.target = 20 - skill.totalBonus;
        }
    }

    _prepareSaves(level) {
        const conBonus = Number(this.system?.stats?.con?.value ?? 0);

        for (const save of Object.values(this.system.saves ?? {})) {
            const hereditaryBonus = Number(save.hereditaryBonus ?? 0);
            const itemBonus = Number(save.itemBonus ?? 0);
            save.target = 20 - conBonus - level - hereditaryBonus - itemBonus;
        }
    }

    _prepareItemsAndArmor() {
        let armorItem = null;
        let fieldItem = null;
        let speciesKinetic = 0;
        let speciesEnergy = 0;
        const speciesSaveBonuses = {};

        for (const item of this.items) {
            if (item.type === "armor" && !armorItem) armorItem = item;
            if (item.type === "field" && !fieldItem) fieldItem = item;
            if (item.type === "speciesTrait") {
                speciesKinetic += Number(item.system.hereditaryArmorKinetic ?? 0);
                speciesEnergy += Number(item.system.hereditaryArmorEnergy ?? 0);
                for (const [key, value] of Object.entries(item.system.saveBonuses ?? {})) {
                    speciesSaveBonuses[key] = Number(speciesSaveBonuses[key] ?? 0) + Number(value ?? 0);
                }
            }
        }

        this.system.armorSummary.type = armorItem?.name ?? "";
        this.system.armorSummary.dexPenalty = Number(armorItem?.system.dexPenalty ?? 0);
        this.system.armorSummary.armor.kinetic = Number(armorItem?.system.kineticDr ?? 0);
        this.system.armorSummary.armor.energy = Number(armorItem?.system.energyDr ?? 0);
        this.system.armorSummary.field.kinetic = Number(fieldItem?.system.kineticDr ?? 0);
        this.system.armorSummary.field.energy = Number(fieldItem?.system.energyDr ?? 0);
        this.system.armorSummary.body.kinetic = speciesKinetic;
        this.system.armorSummary.body.energy = speciesEnergy;
        this.system.movement.armorPenalty = Number(armorItem?.system.speedPenalty ?? 0);

        for (const [saveKey, save] of Object.entries(this.system.saves ?? {})) {
            save.hereditaryBonus = Number(speciesSaveBonuses[saveKey] ?? save.hereditaryBonus ?? 0);
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

            if (item.type === "weapon") {
                equipmentBulkNotInPack += Number(item.system.bulk ?? 0);
            }
        }

        this.system.load.equipmentBulkInPack = equipmentBulkInPack;
        this.system.load.equipmentBulkNotInPack = equipmentBulkNotInPack;
        this.system.load.totalBulkWithoutPack = equipmentBulkNotInPack;
        this.system.load.totalBulkWithPack = equipmentBulkInPack + equipmentBulkNotInPack;
        this.system.load.rating = 5 + Number(this.system?.stats?.str?.value ?? 0);
    }

    _prepareMovement() {
        const base = Number(this.system.movement.base ?? 30);
        const armorPenalty = Number(this.system.movement.armorPenalty ?? 0);
        const withPackPenalty = Number(this.system.movement.burdenedPenaltyWithPack ?? 0);
        const withoutPackPenalty = Number(this.system.movement.burdenedPenaltyWithoutPack ?? 0);

        this.system.movement.totalWithPack = Math.max(0, base - armorPenalty - withPackPenalty);
        this.system.movement.totalWithoutPack = Math.max(0, base - armorPenalty - withoutPackPenalty);
    }

    _prepareDr() {
        this.system.armorSummary.total.kinetic =
            Number(this.system.armorSummary.body.kinetic ?? 0) +
            Number(this.system.armorSummary.armor.kinetic ?? 0) +
            Number(this.system.armorSummary.field.kinetic ?? 0);

        this.system.armorSummary.total.energy =
            Number(this.system.armorSummary.body.energy ?? 0) +
            Number(this.system.armorSummary.armor.energy ?? 0) +
            Number(this.system.armorSummary.field.energy ?? 0);
    }
}
