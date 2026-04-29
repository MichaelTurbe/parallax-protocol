const fields = foundry.data.fields;

export class ParallaxArmorData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            bulk: new fields.NumberField({ initial: 0, min: 0 }),
            dexPenalty: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            speedPenalty: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            kineticDr: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            energyDr: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            notes: new fields.HTMLField({ initial: "" }),
        };
    }
}
