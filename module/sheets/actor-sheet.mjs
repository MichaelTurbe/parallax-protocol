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
    _pendingScrollTop = null;

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
        classes: ["parallax", "sheet", "actor", "character-sheet"],
        tag: "form",
        window: {
            title: "Parallax Protocol Character",
            resizable: false,
        },
        position: {
            width: 1280,
            height: 860,
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

    _getSheetBody() {
        return this.element?.querySelector?.(".sheet-body") ?? null;
    }

    _captureScrollTop() {
        const body = this._getSheetBody();
        this._pendingScrollTop = body ? body.scrollTop : null;
    }

    async _onRender(context, options) {
        await super._onRender(context, options);

        if (Number.isFinite(this._pendingScrollTop)) {
            const body = this._getSheetBody();
            if (body) body.scrollTop = this._pendingScrollTop;
        }

        this._pendingScrollTop = null;
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
            actorImage: actor.img || "icons/svg/mystery-man.svg",
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

        htmlElement.addEventListener("dragover", (event) => this._onDragOver(event));
        htmlElement.addEventListener("drop", (event) => this._onDrop(event));

        htmlElement.querySelectorAll("[data-pp-action]").forEach((element) => {
            element.addEventListener("click", (event) => this._onClickAction(event, element));
        });

        htmlElement.querySelectorAll("input, select, textarea").forEach((element) => {
            element.addEventListener("change", (event) => this._onChangeInput(event));
        });
    }

    _onDragOver(event) {
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    }

    async _onDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        const itemData = await this._getDroppedItemData(event);
        if (!itemData) return;

        this._captureScrollTop();
        await this.document.createEmbeddedDocuments("Item", [itemData]);
    }

    async _getDroppedItemData(event) {
        let data;
        try {
            data = TextEditor.getDragEventData(event);
        } catch (_error) {
            return null;
        }

        const droppedType = data?.type ?? data?.documentName;
        if (droppedType !== "Item") {
            ui.notifications?.warn("Only items can be dropped on this sheet.");
            return null;
        }

        let sourceItem = null;
        if (data.uuid) {
            sourceItem = await fromUuid(data.uuid);
        } else if (data.pack && data.id) {
            sourceItem = await game.packs.get(data.pack)?.getDocument(data.id);
        }

        if (!sourceItem && data.data) {
            sourceItem = data.data;
        }

        if (!sourceItem) {
            ui.notifications?.warn("Could not import the dropped item.");
            return null;
        }

        const itemObject = typeof sourceItem.toObject === "function"
            ? sourceItem.toObject()
            : foundry.utils.deepClone(sourceItem);

        const allowedTypes = new Set(["weapon", "armor", "field", "gear", "speciesTrait"]);
        if (!allowedTypes.has(itemObject.type)) {
            ui.notifications?.warn(`Unsupported item type: ${itemObject.type ?? "unknown"}.`);
            return null;
        }

        delete itemObject._id;
        delete itemObject.folder;
        delete itemObject.sort;
        delete itemObject.ownership;
        delete itemObject.pack;
        delete itemObject._stats;

        return itemObject;
    }

    async _onChangeInput(event) {
        this._captureScrollTop();

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
        this._captureScrollTop();

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
            this._captureScrollTop();
            this.tabGroups.primary = target.dataset.tabId ?? "overview";
            return this.render();
        }

        if (action === "setRollMode") {
            this._captureScrollTop();
            this._rollMode = target.dataset.rollMode ?? "normal";
            return this.render();
        }

        if (action === "choosePortrait") {
            const picker = new foundry.applications.apps.FilePicker({
                type: "image",
                current: this.document.img || "",
                callback: async (path) => {
                    this._captureScrollTop();
                    await this.document.update({ img: path });
                },
            });

            return picker.browse(this.document.img || "");
        }

        if (action === "clearPortrait") {
            this._captureScrollTop();
            return this.document.update({ img: "icons/svg/mystery-man.svg" });
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
            if (!item?.sheet) return;

            item.sheet._parentSheet = this;
            await item.sheet.render(true);

            const actorPosition = this.position ?? {};
            item.sheet.setPosition?.({
                left: Number(actorPosition.left ?? 120) + 40,
                top: Number(actorPosition.top ?? 80) + 40,
            });
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
            return this._consumeRollMode((mode) => rollInitiative(actor, false, mode));
        }

        if (action === "rollWeaponAttack") {
            const weapon = actor.items.get(target.dataset.itemId);
            if (!weapon) return;
            return this._consumeRollMode((mode) => rollWeaponAttack(actor, weapon, mode));
        }
    }
}
