const fields = foundry.data.fields;

export class ParallaxWeaponData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            classification: new fields.StringField({ initial: "melee" }),
            linkedSkill: new fields.StringField({ initial: "meleeWeapons" }),
            attackBonusMode: new fields.StringField({ initial: "linked" }),
            manualAttackBonus: new fields.NumberField({ initial: 0, integer: true }),
            damageSingle: new fields.StringField({ initial: "1d6" }),
            damageAutomatic: new fields.StringField({ initial: "" }),
            damageType: new fields.StringField({ initial: "p" }),
            bulk: new fields.NumberField({ initial: 0, min: 0 }),
            rangeShort: new fields.NumberField({ initial: 0, min: 0 }),
            rangeLong: new fields.NumberField({ initial: 0, min: 0 }),
            rangeMax: new fields.NumberField({ initial: 0, min: 0 }),
            notes: new fields.HTMLField({ initial: "" }),
        };
    }
}
