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
    _rollMode = "normal";

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
            submitOnChange: false,
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
                statLabel: skill?.stat ? String(skill.stat).toUpperCase() : "",
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
            rollMode: this._rollMode ?? "normal",
            rollModes: {
                normal: "Normal",
                advantage: "Advantage",
                disadvantage: "Disadvantage",
            },
            skillCategories: PARALLAX.skillCategories,
            skillsByCategory,
            saveTypes: PARALLAX.saveTypes,
            priorities: PARALLAX.skillCategories,
            meleeWeapons,
            rangedWeapons,
            gear,
            armorItems,
            fieldItems,
            speciesTraits,
        };
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);

        htmlElement.querySelectorAll("[data-pp-action]").forEach((element) => {
            element.addEventListener("click", (event) => this._onClickAction(event, element));
        });

        htmlElement.querySelectorAll("input, select, textarea").forEach((element) => {
            element.addEventListener("change", (event) => this._onChangeInput(event));
        });
    }

    async _onChangeInput(event) {
        const element = event.currentTarget;
        if (!element?.name) return;

        const path = element.name;
        let value;

        if (element.type === "checkbox") {
            value = Boolean(element.checked);
        } else if (element.type === "number") {
            const rawValue = element.value;
            value = rawValue === "" ? 0 : Number(rawValue);
        } else {
            value = element.value;
        }

        if (path.startsWith("system.skills.")) {
            const parts = path.split(".");
            const skillKey = parts[2];
            const fieldKey = parts[3];
            const currentSkill = foundry.utils.deepClone(this.document.system.skills?.[skillKey] ?? {});
            currentSkill[fieldKey] = value;
            await this.document.update({ [`system.skills.${skillKey}`]: currentSkill });
            return;
        }

        if (path.startsWith("system.saves.")) {
            const parts = path.split(".");
            const saveKey = parts[2];
            const fieldKey = parts[3];
            const currentSave = foundry.utils.deepClone(this.document.system.saves?.[saveKey] ?? {});
            currentSave[fieldKey] = value;
            await this.document.update({ [`system.saves.${saveKey}`]: currentSave });
            return;
        }

        await this.document.update({ [path]: value });
    }

    async _consumeRollMode(callback) {
        const mode = this._rollMode ?? "normal";
        await callback(mode);
        this._rollMode = "normal";
        return this.render();
    }

    async _onClickAction(event, target) {
        event.preventDefault();
        event.stopPropagation();

        const action = target.dataset.ppAction;
        const actor = this.document;

        if (action === "tab") {
            this.tabGroups.primary = target.dataset.tabId ?? "overview";
            return this.render();
        }

        if (action === "setRollMode") {
            this._rollMode = target.dataset.rollMode ?? "normal";
            return this.render();
        }

        if (action === "createItem") {
            const itemType = target.dataset.itemType;
            const classification = target.dataset.classification ?? "melee";
            const defaults = {
                weapon: {
                    classification,
                    linkedSkill: classification === "melee" ? "meleeWeapons" : "firearmsSmall",
                    attackBonusMode: "linked",
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
            return this._consumeRollMode((mode) => rollSkillCheck(actor, target.dataset.skillKey, mode));
        }

        if (action === "rollSkillContest") {
            return this._consumeRollMode((mode) => rollSkillContest(actor, target.dataset.skillKey, mode));
        }

        if (action === "rollSave") {
            return this._consumeRollMode((mode) => rollSave(actor, target.dataset.saveKey, mode));
        }

        if (action === "rollInitiative") {
            return this._consumeRollMode(() => rollInitiative(actor));
        }

        if (action === "rollWeaponAttack") {
            const weapon = actor.items.get(target.dataset.itemId);
            if (!weapon) return;
            return this._consumeRollMode((mode) => rollWeaponAttack(actor, weapon, mode));
        }
    }
}
