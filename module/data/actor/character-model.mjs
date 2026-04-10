const fields = foundry.data.fields;

export class ParallaxCharacterData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            identity: new fields.SchemaField({
                species: new fields.StringField({ initial: "" }),
                homeworld: new fields.StringField({ initial: "" }),
                level: new fields.NumberField({ initial: 1, min: 1, integer: true }),
                hitDie: new fields.NumberField({ initial: 8, min: 1, integer: true }),
            }),
            stats: new fields.SchemaField({
                str: new fields.SchemaField({ value: new fields.NumberField({ initial: 0, integer: true }) }),
                dex: new fields.SchemaField({ value: new fields.NumberField({ initial: 0, integer: true }) }),
                con: new fields.SchemaField({ value: new fields.NumberField({ initial: 0, integer: true }) }),
                int: new fields.SchemaField({ value: new fields.NumberField({ initial: 0, integer: true }) }),
                wis: new fields.SchemaField({ value: new fields.NumberField({ initial: 0, integer: true }) }),
                cha: new fields.SchemaField({ value: new fields.NumberField({ initial: 0, integer: true }) }),
            }),
            hp: new fields.SchemaField({
                value: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                max: new fields.NumberField({ initial: 0, min: 0, integer: true }),
            }),
            movement: new fields.SchemaField({
                base: new fields.NumberField({ initial: 30, min: 0, integer: true }),
                armorPenalty: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                burdenedPenaltyWithPack: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                burdenedPenaltyWithoutPack: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                totalWithPack: new fields.NumberField({ initial: 30, min: 0, integer: true }),
                totalWithoutPack: new fields.NumberField({ initial: 30, min: 0, integer: true }),
            }),
            load: new fields.SchemaField({
                rating: new fields.NumberField({ initial: 5, min: 0, integer: true }),
                equipmentBulkInPack: new fields.NumberField({ initial: 0, min: 0 }),
                equipmentBulkNotInPack: new fields.NumberField({ initial: 0, min: 0 }),
                totalBulkWithPack: new fields.NumberField({ initial: 0, min: 0 }),
                totalBulkWithoutPack: new fields.NumberField({ initial: 0, min: 0 }),
            }),
            armorSummary: new fields.SchemaField({
                type: new fields.StringField({ initial: "" }),
                dexPenalty: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                body: new fields.SchemaField({
                    kinetic: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                    energy: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                }),
                armor: new fields.SchemaField({
                    kinetic: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                    energy: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                }),
                field: new fields.SchemaField({
                    kinetic: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                    energy: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                }),
                total: new fields.SchemaField({
                    kinetic: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                    energy: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                }),
            }),
            priorities: new fields.SchemaField({
                first: new fields.StringField({ initial: "martial" }),
                second: new fields.StringField({ initial: "intellectual" }),
                third: new fields.StringField({ initial: "physical" }),
                fourth: new fields.StringField({ initial: "subtle" }),
            }),
            trainedSkillBonuses: new fields.SchemaField({
                martial: new fields.NumberField({ initial: 4, integer: true }),
                intellectual: new fields.NumberField({ initial: 3, integer: true }),
                physical: new fields.NumberField({ initial: 2, integer: true }),
                subtle: new fields.NumberField({ initial: 1, integer: true }),
            }),
            skills: new fields.ObjectField({ initial: {} }),
            saves: new fields.ObjectField({ initial: {} }),
            combat: new fields.SchemaField({
                awareness: new fields.SchemaField({
                    totalBonus: new fields.NumberField({ initial: 0, integer: true }),
                    target: new fields.NumberField({ initial: 20, integer: true }),
                }),
                deflection: new fields.SchemaField({
                    totalBonus: new fields.NumberField({ initial: 0, integer: true }),
                    target: new fields.NumberField({ initial: 20, integer: true }),
                }),
                evasion: new fields.SchemaField({
                    totalBonus: new fields.NumberField({ initial: 0, integer: true }),
                    target: new fields.NumberField({ initial: 20, integer: true }),
                }),
                initiativeBonus: new fields.NumberField({ initial: 0, integer: true }),
            }),
            notes: new fields.HTMLField({ initial: "" }),
        };
    }
}
