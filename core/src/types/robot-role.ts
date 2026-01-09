export const RobotRoles = {
    Combat: 'Combat',
    Infiltration: 'Infiltration',
    Governance: 'Governance',
    Armored: 'Armored',
    Construction: 'Construction',
    Surgical: 'Surgical',
} as const;
export type RobotRole = (typeof RobotRoles)[keyof typeof RobotRoles];
