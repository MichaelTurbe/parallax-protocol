export const DiceTypes = {
    d4: 'd4',
    d6: 'd6',
    d8: 'd8',
    d10: 'd10',
    d12: 'd12',
    d20: 'd20',
} as const;
export type DieType = (typeof DiceTypes)[keyof typeof DiceTypes];
