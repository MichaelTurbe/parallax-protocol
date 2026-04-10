const fields = foundry.data.fields;

export class ParallaxGearData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            category: new fields.StringField({ initial: "mundane" }),
            bulk: new fields.NumberField({ initial: 0, min: 0 }),
            inPack: new fields.BooleanField({ initial: false }),
            notes: new fields.HTMLField({ initial: "" }),
        };
    }
}
