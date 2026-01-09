export const KineticDamageTypes = {
    Bludgeoning: 'Bludgenoning',
    Piercing: 'Piercing',
    Slashing: 'Slashing',
} as const;
export type KineticDamageType = (typeof KineticDamageTypes)[keyof typeof KineticDamageTypes];
