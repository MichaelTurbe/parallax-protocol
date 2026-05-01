import { PARALLAX } from "../config.mjs";
import {
    rollInitiative,
    rollSave,
    rollSkillCheck,
    rollSkillContest,
    rollWeaponAttackCheck,
    rollWeaponAttackContest,
} from "../dice/rolls.mjs";

const { HandlebarsApplicationMixin, DocumentSheetV2 } = foundry.applications.api;
const CORE_SKILLS = ["awareness", "deflection", "evasion"];

export class ParallaxStatblockSheet extends HandlebarsApplicationMixin(DocumentSheetV2) {
    _rollMode = "normal";
    _pendingScrollTop = null;
    _hasAppliedDefaultPosition = false;

    static DEFAULT_OPTIONS = {
        ...super.DEFAULT_OPTIONS,
        classes: ["parallax", "sheet", "actor", "statblock-sheet"],
        tag: "form",
        window: {
            ...super.DEFAULT_OPTIONS.window,
            title: "Parallax Protocol Stat Block",
            resizable: true,
        },
        position: {
            ...super.DEFAULT_OPTIONS.position,
            width: 750,
            height: 640,
        },
        form: {
            ...super.DEFAULT_OPTIONS.form,
            submitOnChange: false,
            closeOnSubmit: false,
        },
    };

    static PARTS = {
        body: {
            template: "systems/parallax-protocol/templates/actor/statblock-sheet.hbs",
        },
    };

    tabGroups = {
        primary: "overview",
    };

    get title() {
        return `${this.document.name} — Parallax Stat Block`;
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

        if (!this._hasAppliedDefaultPosition) {
            const width = Math.max(this.position?.width ?? 750, 700);
            const height = Math.max(this.position?.height ?? 640, 600);
            this.setPosition({ width, height });
            this._hasAppliedDefaultPosition = true;
        }

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

        const skillEntries = Object.entries(system.skills ?? {});
        const skillsByKey = Object.fromEntries(skillEntries.map(([key, skill]) => [key, { key, ...skill }]));

        const coreSkills = CORE_SKILLS.map(
            (key) => skillsByKey[key] ?? { key, label: PARALLAX.skills[key]?.label ?? key, bonus: 0, target: 20, isCore: true }
        );

        const extraSkills = skillEntries
            .filter(([key]) => !CORE_SKILLS.includes(key))
            .map(([key, skill]) => ({ key, ...skill }))
            .sort((a, b) => String(a.label ?? "").localeCompare(String(b.label ?? "")));

        const availableSkillChoices = Object.entries(PARALLAX.skills)
            .filter(([key]) => !CORE_SKILLS.includes(key) && !system.skills?.[key])
            .map(([key, skill]) => ({ key, label: skill.label }))
            .sort((a, b) => a.label.localeCompare(b.label));

        const hasAvailableSkills = availableSkillChoices.length > 0;

        const weapons = actor.items.filter((item) => item.type === "weapon");
        const meleeWeapons = [];
        const rangedWeapons = [];

        for (const weapon of weapons) {
            const attackBonus = weapon.system.attackBonusMode === "manual"
                ? Number(weapon.system.manualAttackBonus ?? 0)
                : Number(system.skills?.[weapon.system.linkedSkill]?.bonus ?? 0);

            const row = {
                id: weapon.id,
                name: weapon.name,
                img: weapon.img,
                attackBonus,
                system: weapon.system,
            };

            if (weapon.system.classification === "melee") meleeWeapons.push(row);
            else rangedWeapons.push(row);
        }

        return {
            ...context,
            actor,
            system,
            actorImage: actor.img || "icons/svg/mystery-man.svg",
            editable: this.isEditable,
            activeTab: this.tabGroups?.primary ?? "overview",
            rollMode: this._rollMode ?? "normal",
            coreSkills,
            extraSkills,
            availableSkillChoices,
            hasAvailableSkills,
            meleeWeapons,
            rangedWeapons,
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
        if (element.type === "checkbox") value = Boolean(element.checked);
        else if (element.type === "number") value = element.value === "" ? 0 : Number(element.value);
        else value = element.value;

        if (path.startsWith("system.skills.")) {
            const parts = path.split(".");
            const skillKey = parts[2];
            const fieldKey = parts[3];
            const currentSkill = foundry.utils.deepClone(this.document.system.skills?.[skillKey] ?? {});
            currentSkill[fieldKey] = value;
            if (fieldKey === "bonus") {
                currentSkill.target = 20 - Number(value ?? 0);
            }
            await this.document.update({ [`system.skills.${skillKey}`]: currentSkill });
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

        if (action === "addSkill") {
            this._captureScrollTop();
            const container = target.closest(".statblock-skill-picker-row") ?? this.element;
            const select = container?.querySelector?.('[data-pp-skill-picker="availableSkill"]');
            const skillKey = String(select?.value ?? "").trim();
            if (!skillKey || actor.system.skills?.[skillKey]) return;

            const configSkill = PARALLAX.skills[skillKey];
            const updatedSkills = foundry.utils.deepClone(actor.system.skills ?? {});
            updatedSkills[skillKey] = {
                label: configSkill?.label ?? skillKey,
                bonus: 0,
                target: 20,
                isCore: false,
            };

            await actor.update({ "system.skills": updatedSkills });
            return;
        }

        if (action === "deleteSkill") {
            this._captureScrollTop();
            const skillKey = target.dataset.skillKey;
            if (!skillKey || CORE_SKILLS.includes(skillKey)) return;
            await actor.update({ [`system.skills.-=${skillKey}`]: null });
            return;
        }

        if (action === "rollSave") {
            const rawTarget = actor.system.summary?.saveTarget;
            const parsedTarget = Number(rawTarget);
            if (!Number.isFinite(parsedTarget)) {
                ui.notifications?.warn("Set a numeric Save Target before rolling a save.");
                return;
            }
            const save = { label: `${actor.name} Save`, target: parsedTarget };
            return this._consumeRollMode((mode) =>
                rollSave({ name: actor.name, system: { saves: { statblock: save } } }, "statblock", mode)
            );
        }

        if (action === "createItem") {
            this._captureScrollTop();
            const itemType = target.dataset.itemType;
            const classification = target.dataset.classification ?? "melee";
            await actor.createEmbeddedDocuments("Item", [{
                name: `New ${itemType}`,
                type: itemType,
                system: itemType === "weapon"
                    ? { classification, linkedSkill: classification === "melee" ? "meleeWeapons" : "firearmsSmall", attackBonusMode: "manual" }
                    : {},
            }]);
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

        if (action === "deleteItem") {
            this._captureScrollTop();
            const item = actor.items.get(target.dataset.itemId);
            if (item) await item.delete();
            return;
        }

        if (action === "rollSkillCheck") {
            return this._consumeRollMode((mode) => rollSkillCheck(actor, target.dataset.skillKey, mode, true));
        }

        if (action === "rollSkillContest") {
            return this._consumeRollMode((mode) => rollSkillContest(actor, target.dataset.skillKey, mode, true));
        }

        if (action === "rollInitiative") {
            return this._consumeRollMode((mode) => rollInitiative(actor, true, mode));
        }

        if (action === "rollWeaponAttackCheck") {
            const weapon = actor.items.get(target.dataset.itemId);
            if (!weapon) return;
            return this._consumeRollMode((mode) => rollWeaponAttackCheck(actor, weapon, mode));
        }

        if (action === "rollWeaponAttackContest") {
            const weapon = actor.items.get(target.dataset.itemId);
            if (!weapon) return;
            return this._consumeRollMode((mode) => rollWeaponAttackContest(actor, weapon, mode));
        }
    }
}
