export const DamageTypes = {
    Kinetic: 'Kinetic',
    Energy: 'Energy',
} as const;
export type DamageType = (typeof DamageTypes)[keyof typeof DamageTypes];
