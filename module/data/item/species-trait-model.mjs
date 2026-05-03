const fields = foundry.data.fields;

export class ParallaxSpeciesTraitData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            hereditaryArmorKinetic: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            hereditaryArmorEnergy: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            saveBonuses: new fields.SchemaField({
                allergy: new fields.NumberField({ initial: 0, integer: true }),
                disease: new fields.NumberField({ initial: 0, integer: true }),
                gas: new fields.NumberField({ initial: 0, integer: true }),
                poison: new fields.NumberField({ initial: 0, integer: true }),
                radiation: new fields.NumberField({ initial: 0, integer: true }),
                stun: new fields.NumberField({ initial: 0, integer: true }),
            }),
            price: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            notes: new fields.HTMLField({ initial: "" }),
        };
    }
}
