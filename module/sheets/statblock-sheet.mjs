import { PARALLAX } from "../config.mjs";
import {
    rollInitiative,
    rollSave,
    rollSkillCheck,
    rollSkillContest,
    rollWeaponAttack,
} from "../dice/rolls.mjs";

const { HandlebarsApplicationMixin, DocumentSheetV2 } = foundry.applications.api;
const CORE_SKILLS = ["awareness", "deflection", "evasion"];

export class ParallaxStatblockSheet extends HandlebarsApplicationMixin(DocumentSheetV2) {
    _rollMode = "normal";
    _bodyScrollTop = 0;

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
        classes: ["parallax", "sheet", "actor", "statblock-sheet"],
        tag: "form",
        window: {
            title: "Parallax Protocol Stat Block",
            resizable: false,
        },
        position: {
            width: 980,
            height: 760,
        },
        form: {
            submitOnChange: false,
            closeOnSubmit: false,
        },
    });

    static PARTS = {
        body: {
            template: "systems/parallax-protocol/templates/actor/statblock-sheet.hbs",
        },
    };

    get title() {
        return `${this.document.name} — Parallax Stat Block`;
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        const actor = this.document;
        const system = actor.system;
        const skillEntries = Object.entries(system.skills ?? {});
        const skillsByKey = Object.fromEntries(skillEntries.map(([key, skill]) => [key, { key, ...skill }]));
        const coreSkills = CORE_SKILLS
            .map((key) => skillsByKey[key] ?? { key, label: PARALLAX.skills[key]?.label ?? key, bonus: 0, target: 20, isCore: true });
        const extraSkills = skillEntries
            .filter(([key]) => !CORE_SKILLS.includes(key))
            .map(([key, skill]) => ({ key, ...skill }))
            .sort((a, b) => String(a.label ?? "").localeCompare(String(b.label ?? "")));

        const availableSkillChoices = Object.entries(PARALLAX.skills)
            .filter(([key]) => !CORE_SKILLS.includes(key) && !system.skills?.[key])
            .map(([key, skill]) => ({ key, label: skill.label }))
            .sort((a, b) => a.label.localeCompare(b.label));

        const hasAvailableSkills = availableSkillChoices.length > 0;

        const weapons = actor.items.filter((item) => item.type === "weapon").map((weapon) => ({
            id: weapon.id,
            name: weapon.name,
            system: weapon.system,
            attackBonus: weapon.system.attackBonusMode === "manual"
                ? Number(weapon.system.manualAttackBonus ?? 0)
                : Number(system.skills?.[weapon.system.linkedSkill]?.bonus ?? 0),
        }));

        return {
            ...context,
            actor,
            system,
            actorImage: actor.img || "icons/svg/mystery-man.svg",
            editable: this.isEditable,
            rollMode: this._rollMode ?? "normal",
            rollModes: {
                normal: "Normal",
                advantage: "Advantage",
                disadvantage: "Disadvantage",
            },
            weapons,
            coreSkills,
            extraSkills,
            availableSkillChoices,
            hasAvailableSkills,
        };
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);

        this._restoreBodyScroll(htmlElement);

        htmlElement.addEventListener("dragover", (event) => this._onDragOver(event));
        htmlElement.addEventListener("drop", (event) => this._onDrop(event));

        htmlElement.querySelectorAll("[data-pp-action]").forEach((element) => {
            element.addEventListener("click", (event) => this._onClickAction(event, element));
        });

        htmlElement.querySelectorAll("input, select, textarea").forEach((element) => {
            element.addEventListener("change", (event) => this._onChangeInput(event));
        });

        this._refreshRollModeButtons(htmlElement);
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

        this._captureBodyScroll();
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


    _captureBodyScroll(root = null) {
        const rootEl = root instanceof HTMLElement ? root : root?.[0] ?? this.element?.[0] ?? this.element ?? null;
        const body = rootEl?.querySelector?.(".sheet-body");
        this._bodyScrollTop = Number(body?.scrollTop ?? 0);
    }

    _restoreBodyScroll(root = null) {
        const rootEl = root instanceof HTMLElement ? root : root?.[0] ?? this.element?.[0] ?? this.element ?? null;
        const body = rootEl?.querySelector?.(".sheet-body");
        if (!body) return;

        requestAnimationFrame(() => {
            body.scrollTop = Number(this._bodyScrollTop ?? 0);
        });
    }

    async _onChangeInput(event) {
        this._captureBodyScroll();

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
        const mode = this._rollMode ?? "normal";
        await callback(mode);
        this._rollMode = "normal";
        this._refreshRollModeButtons();
    }

    _refreshRollModeButtons(root = null) {
        const host = root ?? this.element;
        const rootEl = host instanceof HTMLElement ? host : host?.[0] ?? null;
        if (!(rootEl instanceof HTMLElement)) return;

        rootEl.querySelectorAll(".roll-mode-button").forEach((button) => {
            const isActive = button.dataset.rollMode === this._rollMode;
            button.classList.toggle("active", Boolean(isActive));
        });
    }

    async _onClickAction(event, target) {
        event.preventDefault();
        event.stopPropagation();

        const action = target.dataset.ppAction;
        const actor = this.document;

        if (action === "setRollMode") {
            this._rollMode = target.dataset.rollMode ?? "normal";
            this._refreshRollModeButtons();
            return;
        }

        if (action === "choosePortrait") {
            const picker = new foundry.applications.apps.FilePicker({
                type: "image",
                current: this.document.img || "",
                callback: async (path) => {
                    await this.document.update({ img: path });
                },
            });
            return picker.browse(this.document.img || "");
        }

        if (action === "clearPortrait") {
            return this.document.update({ img: "icons/svg/mystery-man.svg" });
        }

        if (action === "addSkill") {
            this._captureBodyScroll();
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
            this._captureBodyScroll();

            const skillKey = target.dataset.skillKey;
            if (!skillKey || CORE_SKILLS.includes(skillKey)) return;

            await actor.update({
                [`system.skills.-=${skillKey}`]: null,
            });
            return;
        }

        if (action === "rollSave") {
            const rawTarget = actor.system.summary?.saveTarget;
            const parsedTarget = Number(rawTarget);
            if (!Number.isFinite(parsedTarget)) {
                ui.notifications?.warn("Set a numeric Save Target before rolling a save.");
                return;
            }

            const save = {
                label: `${actor.name} Save`,
                target: parsedTarget,
            };

            return this._consumeRollMode((mode) => rollSave({ system: { saves: { statblock: save } } }, "statblock", mode));
        }

        if (action === "createItem") {
            this._captureBodyScroll();
            const itemType = target.dataset.itemType;
            const classification = target.dataset.classification ?? "melee";
            await actor.createEmbeddedDocuments("Item", [{
                name: "New weapon",
                type: itemType,
                system: {
                    classification,
                    linkedSkill: classification === "melee" ? "meleeWeapons" : "firearmsSmall",
                    attackBonusMode: "manual",
                },
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
            this._captureBodyScroll();
            const item = actor.items.get(target.dataset.itemId);
            if (item) await item.delete();
            return;
        }

        if (action === "rollSkillCheck") {
            const skill = actor.system.skills?.[target.dataset.skillKey];
            if (!skill) return;
            return this._consumeRollMode((mode) => rollSkillCheck(actor, target.dataset.skillKey, mode, true));
        }

        if (action === "rollSkillContest") {
            return this._consumeRollMode((mode) => rollSkillContest(actor, target.dataset.skillKey, mode, true));
        }

        if (action === "rollInitiative") {
            return this._consumeRollMode((mode) => rollInitiative(actor, true, mode));
        }

        if (action === "rollWeaponAttack") {
            const weapon = actor.items.get(target.dataset.itemId);
            if (!weapon) return;
            return this._consumeRollMode((mode) => rollWeaponAttack(actor, weapon, mode));
        }
    }
}
