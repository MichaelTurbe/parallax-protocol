const IMG = "systems/parallax-protocol/assets/icons/mundane-gear.svg";

const items = [
    {
        name: "Backpack",
        img: IMG,
        type: "gear",
        system: {
            category: "mundane",
            bulk: 1,
            inPack: false,
            notes: "<p>An ordinary pack.</p>",
        },
    },
    {
        name: "Bandolier",
        img: IMG,
        type: "gear",
        system: {
            category: "mundane",
            bulk: 1,
            inPack: false,
            notes: "<p>Holds up to 4 appropriately sized items of zero bulk for easy access, such as daggers, grenades, medpacks, face masks, etc.</p>",
        },
    },
    {
        name: "Synth Rope",
        img: IMG,
        type: "gear",
        system: {
            category: "mundane",
            bulk: 2,
            inPack: false,
            notes: "<p>50 feet of sturdy synthetic rope.</p>",
        },
    },
];

const folder = await Folder.create({ name: "Mundane Gear", type: "Item" });
const created = await Item.createDocuments(items.map(d => ({ ...d, folder: folder.id })));
ui.notifications.info(`Created ${created.length} mundane gear items in folder "${folder.name}".`);
