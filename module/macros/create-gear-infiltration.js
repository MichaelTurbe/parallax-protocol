const IMG = "systems/parallax-protocol/assets/icons/infiltration.svg";

const items = [
    {
        name: "Chameleon Cloak",
        img: IMG,
        type: "gear",
        system: {
            category: "infiltration",
            bulk: 1,
            inPack: false,
            notes: "<p>Advanced microfilament cloak that looks like ordinary fabric until activated. Actively creates live, shifting camouflage. Provides a +3 item bonus to Stealth checks.</p>",
        },
    },
    {
        name: "Infrared Goggles",
        img: IMG,
        type: "gear",
        system: {
            category: "infiltration",
            bulk: 1,
            inPack: false,
            notes: "<p>Goggles that interface with any comm device to provide infrared vision. Can be toggled on or off via subvocal command.</p>",
        },
    },
];

const folder = await Folder.create({ name: "Infiltration Equipment", type: "Item" });
const created = await Item.createDocuments(items.map(d => ({ ...d, folder: folder.id })));
ui.notifications.info(`Created ${created.length} infiltration equipment items in folder "${folder.name}".`);
