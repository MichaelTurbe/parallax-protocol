const { HandlebarsApplicationMixin, DocumentSheetV2 } = foundry.applications.api;

export class ParallaxItemSheet extends HandlebarsApplicationMixin(DocumentSheetV2) {
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
        classes: ["parallax", "sheet", "item"],
        tag: "form",
        position: { width: 520, height: 520 },
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

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        const config = game.parallax?.config ?? {};
        const skills = config.skills ?? {};

        return {
            ...context,
            item: this.document,
            system: this.document.system,
            editable: this.isEditable,
            itemType: this.document.type,
            isWeapon: this.document.type === "weapon",
            isArmor: this.document.type === "armor",
            isField: this.document.type === "field",
            isGear: this.document.type === "gear",
            isSpeciesTrait: this.document.type === "speciesTrait",
            weaponClassifications: config.weaponClassifications ?? {},
            damageTypes: config.damageTypes ?? {},
            gearCategories: config.gearCategories ?? {},
            attackModeOptions: {
                linked: "Linked",
                manual: "Manual",
            },
            skillOptions: Object.fromEntries(
                Object.entries(skills).map(([key, value]) => [key, value.label])
            ),
        };
    }
}
