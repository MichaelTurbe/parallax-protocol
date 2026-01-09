export const WeaponTypes = {
    Manufactured: 'Manufactured',
    Natural: 'Natural',
} as const;
export type WeaponType = (typeof WeaponTypes)[keyof typeof WeaponTypes];
