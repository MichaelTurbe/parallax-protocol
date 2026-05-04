const PACK_ID = 'parallax-protocol.parallax-protocol-items';

const FOLDER_NAMES = [
    'Small Arms',
    'Long Arms',
    'Heavy Arms',
    'Melee Weapons',
    'Grenades',
    'Armor',
    'Field Generators',
    'Combat Accessories',
    'Survival Gear',
    'Medical Gear',
    'Technical Equipment',
    'Parts',
    'Comm Devices',
    'Infiltration Equipment',
    'Mundane Gear',
    'Drones',
];

const pack = game.packs.get(PACK_ID);
if (!pack) {
    ui.notifications.error(`Pack "${PACK_ID}" not found. Is system.json up to date?`);
    return;
}

await pack.configure({ locked: false });

const packDocs = await pack.getDocuments();
const packDocsByName = new Map(packDocs.map(d => [d.name, d]));

let created = 0, updated = 0, skipped = 0;

for (const folderName of FOLDER_NAMES) {
    const worldFolder = game.folders.find(f => f.type === 'Item' && f.name === folderName);
    if (!worldFolder) {
        console.warn(`Parallax Sync | World folder "${folderName}" not found — skipping.`);
        skipped++;
        continue;
    }

    let compFolder = pack.folders.find(f => f.name === folderName);
    if (!compFolder) {
        compFolder = await Folder.create(
            { name: folderName, type: 'Item', pack: PACK_ID },
            { pack: PACK_ID }
        );
    }

    const worldItems = game.items.filter(i => i.folder?.id === worldFolder.id);

    for (const item of worldItems) {
        const itemData = item.toObject();
        delete itemData._id;
        itemData.folder = compFolder.id;

        const existing = packDocsByName.get(item.name);
        if (existing) {
            await existing.update(itemData);
            updated++;
        } else {
            await Item.create(itemData, { pack: PACK_ID });
            created++;
        }
    }
}

ui.notifications.info(`Sync complete — ${created} created, ${updated} updated, ${skipped} folders skipped.`);
