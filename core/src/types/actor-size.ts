export const ActorSizes = {
    Small: 'Small',
    Medium: 'Medium',
    Large: 'Large',
    Huge: 'Huge',
    Enormous: 'Enormous',
} as const;
export type ActorSize = (typeof ActorSizes)[keyof typeof ActorSizes];
