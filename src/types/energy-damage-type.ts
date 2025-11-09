export const EnergyDamageTypes = {
    Fire: 'Fire',
    Cold: 'Cold',
    Acid: 'Acid',
    Electrical: 'Electrical',
} as const;
export type EnergyDamageType = (typeof EnergyDamageTypes)[keyof typeof EnergyDamageTypes];
