export const BuilderTypes = {
    Beast: 'Beast',
    Robot: 'Robot',
} as const;
export type BuilderType = (typeof BuilderTypes)[keyof typeof BuilderTypes];
