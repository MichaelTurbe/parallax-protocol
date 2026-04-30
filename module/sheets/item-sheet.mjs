const { HandlebarsApplicationMixin, DocumentSheetV2 } = foundry.applications.api;

export class ParallaxItemSheet extends HandlebarsApplicationMixin(DocumentSheetV2) {
    get title() {
        return `${this.document.name} — Parallax Item`;
    }

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
        classes: ["parallax", "sheet", "item", "item-sheet"],
        tag: "form",
        position: { width: 560, height: 620 },
        window: { resizable: true },
        form: {
            submitOnChange: true,
            closeOnSubmit: false,
        },
    });

    static PARTS = {
        body: {
            template: "systems/parallax-protocol/templates/item/item-sheet.hbs",
        },
    };


    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);

        htmlElement.querySelectorAll("[data-pp-action]").forEach((element) => {
            element.addEventListener("click", (event) => this._onClickAction(event, element));
        });

        htmlElement.querySelectorAll("input, select, textarea, prose-mirror").forEach((element) => {
            element.addEventListener("change", () => this._queueParentSheetRefresh());
        });
    }

    async _onClickAction(event, target) {
        event.preventDefault();
        event.stopPropagation();

        if (target.dataset.ppAction === "choosePortrait") {
            const picker = new foundry.applications.apps.FilePicker({
                type: "image",
                current: this.document.img || "",
                callback: async (path) => {
                    await this.document.update({ img: path });
                },
            });
            return picker.browse(this.document.img || "");
        }
    }

    _queueParentSheetRefresh() {
        if (!this._parentSheet) return;

        window.clearTimeout(this._parentSheetRefreshTimeout);
        this._parentSheetRefreshTimeout = window.setTimeout(() => {
            this._parentSheet?.render(false);
        }, 150);
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        const config = game.parallax?.config ?? {};
        const skills = config.skills ?? {};

        const system = this.document.system;
        const damageClass = system.damageClass ?? "kinetic";
        const damageTypeOptions = damageClass === "energy"
            ? (config.energyDamageTypes ?? {})
            : (config.kineticDamageTypes ?? {});

        const enrichedNotes = await TextEditor.enrichHTML(system.notes ?? "");

        return {
            ...context,
            item: this.document,
            system,
            enrichedNotes,
            editable: this.isEditable,
            itemType: this.document.type,
            isWeapon: this.document.type === "weapon",
            isArmor: this.document.type === "armor",
            isField: this.document.type === "field",
            isGear: this.document.type === "gear",
            isSpeciesTrait: this.document.type === "speciesTrait",
            weaponClassifications: config.weaponClassifications ?? {},
            damageClasses: config.damageClasses ?? {},
            damageTypeOptions,
            gearCategories: config.gearCategories ?? {},
            attackBonusModes: {
                linked: "Linked",
                manual: "Manual",
            },
            skillOptions: Object.fromEntries(Object.entries(skills).map(([key, value]) => [key, value.label])),
        };
    }

    async close(options) {
        const result = await super.close(options);

        if (this._parentSheet) {
            await this._parentSheet.render(false);
            this._parentSheet.bringToFront?.();
        }

        return result;
    }
}
