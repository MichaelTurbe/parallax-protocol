const fields = foundry.data.fields;

// Combat shields provide kinetic DR only (rulebook 0.9.6.2, p. 68).
export class ParallaxShieldData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            bulk: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            kineticDr: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            price: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            notes: new fields.HTMLField({ initial: "" }),
        };
    }
}
