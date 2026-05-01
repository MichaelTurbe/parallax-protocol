const fields = foundry.data.fields;

export class ParallaxStatblockData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            summary: new fields.SchemaField({
                kindLabel: new fields.StringField({ initial: "" }),
                level: new fields.NumberField({ initial: 1, min: 0, integer: true }),
                hitDie: new fields.StringField({ initial: "D8" }),
                size: new fields.StringField({ initial: "M" }),
                speed: new fields.NumberField({ initial: 30, min: 0, integer: true }),
                saveTarget: new fields.StringField({ initial: "-" }),
            }),
            hp: new fields.SchemaField({
                value: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                max: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            }),
            defenses: new fields.SchemaField({
                evasion: new fields.NumberField({ initial: 0, integer: true }),
                deflection: new fields.NumberField({ initial: 0, integer: true }),
                initiativeBonus: new fields.NumberField({ initial: 0, integer: true }),
                kineticDr: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                energyDr: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            }),
            skills: new fields.ObjectField({ initial: {} }),
            description: new fields.HTMLField({ initial: "" }),
            notes: new fields.HTMLField({ initial: "" }),
        };
    }
}
