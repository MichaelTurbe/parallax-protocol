const SYSTEM_ID = "parallax-protocol";
const SETTING_KEY = "systemMigrationVersion";

// Each migration runs once per world, in order, when the stored version is older than its version.
const MIGRATIONS = [
    { version: "0.1.0", label: "skill ranks", migrateActor: migrateSkillRanks },
];

export function registerMigrationSettings() {
    game.settings.register(SYSTEM_ID, SETTING_KEY, {
        name: "System Migration Version",
        scope: "world",
        config: false,
        type: String,
        default: "0.0.0",
    });
}

export async function migrateWorld() {
    if (!game.users.activeGM?.isSelf) return;

    const storedVersion = game.settings.get(SYSTEM_ID, SETTING_KEY);
    const pending = MIGRATIONS.filter((migration) => foundry.utils.isNewerVersion(migration.version, storedVersion));
    if (!pending.length) return;

    for (const migration of pending) {
        ui.notifications.info(`Parallax Protocol | Migrating world data (${migration.label})…`);
        let migrated = 0;

        for (const actor of game.actors) {
            try {
                const update = migration.migrateActor(actor);
                if (!update) continue;
                await actor.update(update);
                migrated++;
            } catch (error) {
                console.error(`Parallax Protocol | Migration ${migration.version} failed for actor ${actor.name}`, error);
            }
        }

        await game.settings.set(SYSTEM_ID, SETTING_KEY, migration.version);
        ui.notifications.info(`Parallax Protocol | Migration ${migration.version} complete: ${migrated} actor(s) updated.`);
    }
}

// 0.1.0: the free-entry trainedSkillBonus becomes the skill rank. The stored "trained" flag is dropped
// (it is now derived from rank), as are derived values earlier sheet code wrote into the source data.
function migrateSkillRanks(actor) {
    if (actor.type !== "character") return null;

    const sourceSkills = actor._source.system?.skills ?? {};
    const skills = {};

    for (const [key, skill] of Object.entries(sourceSkills)) {
        const legacyBonus = skill?.trainedSkillBonus ?? skill?.frozenTrainedBonus ?? 0;
        skills[key] = {
            rank: Number(skill?.rank ?? legacyBonus) || 0,
            itemBonus: Number(skill?.itemBonus ?? 0) || 0,
        };
    }

    return { "system.skills": foundry.data.operators.ForcedReplacement.create(skills) };
}
