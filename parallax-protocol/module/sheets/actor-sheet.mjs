import { PARALLAX } from "../config.mjs";
import {
    rollInitiative,
    rollSave,
    rollSkillCheck,
    rollSkillContest,
    rollWeaponAttack,
} from "../dice/rolls.mjs";

const { HandlebarsApplicationMixin, DocumentSheetV2 } = foundry.applications.api;

export class ParallaxCharacterSheet extends HandlebarsApplicationMixin(DocumentSheetV2) {
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
        id: "parallax-character-sheet",
        classes: ["parallax", "sheet", "actor", "character-sheet"],
        tag: "form",
        window: {
            title: "Parallax Protocol Character",
            resizable: true,
        },
        position: {
            width: 980,
            height: 820,
        },
        form: {
            submitOnChange: true,
            closeOnSubmit: false,
        },
    });

    static PARTS = {
        body: {
            template: "systems/parallax-protocol/templates/actor/character-sheet.hbs",
        },
    };

    tabGroups = {
        primary: "overview",
    };

    get title() {
        return `${this.document.name} — Parallax Protocol`;
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        const actor = this.document;
        const system = actor.system;

        const skillsByCategory = {};
        for (const categoryKey of Object.keys(PARALLAX.skillCategories)) {
            skillsByCategory[categoryKey] = [];
        }

        for (const [key, skill] of Object.entries(system.skills ?? {})) {
            const categoryKey = skill?.category;
            if (!categoryKey || !skillsByCategory[categoryKey]) continue;

            skillsByCategory[categoryKey].push({
                key,
                ...skill,
                statLabel: skill?.stat ? String(skill.stat).toUpperCase() : "—",
            });
        }

        for (const category of Object.values(skillsByCategory)) {
            category.sort((a, b) => a.label.localeCompare(b.label));
        }

        const weapons = actor.items.filter((item) => item.type === "weapon");
        const meleeWeapons = [];
        const rangedWeapons = [];

        for (const weapon of weapons) {
            const linkedSkill = system.skills?.[weapon.system.linkedSkill];
            const linkedBonus = linkedSkill?.totalBonus ?? 0;
            const attackBonus = weapon.system.attackBonusMode === "manual"
                ? Number(weapon.system.manualAttackBonus ?? 0)
                : linkedBonus;

            const row = {
                id: weapon.id,
                name: weapon.name,
                classification: weapon.system.classification,
                attackBonus,
                system: weapon.system,
            };

            if (weapon.system.classification === "melee") meleeWeapons.push(row);
            else rangedWeapons.push(row);
        }

        const gear = actor.items.filter((item) => item.type === "gear");
        const armorItems = actor.items.filter((item) => item.type === "armor");
        const fieldItems = actor.items.filter((item) => item.type === "field");
        const speciesTraits = actor.items.filter((item) => item.type === "speciesTrait");

        return {
            ...context,
            actor,
            system,
            editable: this.isEditable,
            activeTab: this.tabGroups?.primary ?? "overview",
            skillCategories: PARALLAX.skillCategories,
            skillsByCategory,
            saveTypes: PARALLAX.saveTypes,
            priorities: PARALLAX.skillCategories,
            rollModeOptions: {
                normal: "Normal",
                advantage: "Advantage",
                disadvantage: "Disadvantage",
            },
            meleeWeapons,
            rangedWeapons,
            gear,
            armorItems,
            fieldItems,
            speciesTraits,
        };
    }

    async _onClickAction(event, target) {
        event.preventDefault();
        const action = target.dataset.action;
        const actor = this.document;
        const defaultRollMode = actor.system.rollSettings?.mode ?? "normal";

        if (action === "tab") {
            this.tabGroups.primary = target.dataset.tabId ?? "overview";
            return this.render();
        }

        if (action === "createItem") {
            const itemType = target.dataset.itemType;
            const classification = target.dataset.classification ?? "melee";
            const defaults = {
                weapon: {
                    classification,
                    linkedSkill: classification === "melee" ? "meleeWeapons" : "firearmsSmall",
                },
                gear: { category: "mundane", inPack: false },
                armor: {},
                field: {},
                speciesTrait: {},
            };

            await actor.createEmbeddedDocuments("Item", [
                {
                    name: `New ${itemType}`,
                    type: itemType,
                    system: defaults[itemType] ?? {},
                },
            ]);
            return;
        }

        if (action === "deleteItem") {
            const item = actor.items.get(target.dataset.itemId);
            if (item) await item.delete();
            return;
        }

        if (action === "editItem") {
            const item = actor.items.get(target.dataset.itemId);
            if (item?.sheet) item.sheet.render(true);
            return;
        }

        if (action === "rollSkillCheck") {
            return rollSkillCheck(actor, target.dataset.skillKey, target.dataset.rollMode ?? defaultRollMode);
        }

        if (action === "rollSkillContest") {
            return rollSkillContest(actor, target.dataset.skillKey, target.dataset.rollMode ?? defaultRollMode);
        }

        if (action === "rollSave") {
            return rollSave(actor, target.dataset.saveKey, target.dataset.rollMode ?? defaultRollMode);
        }

        if (action === "rollInitiative") {
            return rollInitiative(actor);
        }

        if (action === "rollWeaponAttack") {
            const item = actor.items.get(target.dataset.itemId);
            if (item) return rollWeaponAttack(actor, item, target.dataset.rollMode ?? defaultRollMode);
        }
    }
}
