export const SkillCategories = {
    Martial: 'Martial',
    Intellectual: 'Intellectual',
    Physical: 'Physical',
    Subtle: 'Subtle',
} as const;
export type SkillCategory = (typeof SkillCategories)[keyof typeof SkillCategories];
