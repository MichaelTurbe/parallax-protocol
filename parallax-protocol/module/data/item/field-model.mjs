const fields = foundry.data.fields;

export class ParallaxFieldData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            kineticDr: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            energyDr: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            notes: new fields.HTMLField({ initial: "" }),
        };
    }
}
