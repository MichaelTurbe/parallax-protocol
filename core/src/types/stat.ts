export const Stats = {
    STR: 'STR',
    DEX: 'DEX',
    CON: 'CON',
    INT: 'INT',
    WIS: 'WIS',
    CHA: 'CHA',
} as const;
export type Stat = (typeof Stats)[keyof typeof Stats];
