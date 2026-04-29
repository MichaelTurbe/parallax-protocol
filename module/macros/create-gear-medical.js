const IMG = "systems/parallax-protocol/assets/icons/medical.svg";

const items = [
    {
        name: "Medpack",
        img: IMG,
        type: "gear",
        system: {
            category: "medical",
            bulk: 0,
            inPack: false,
            notes: "<p>Restores 1d8 hit points.</p>",
        },
    },
    {
        name: "Rotgut Remedy",
        img: IMG,
        type: "gear",
        system: {
            category: "medical",
            bulk: 0,
            inPack: false,
            notes: "<p>Nasty blood coagulant and adreno-draught that heals 1d6 hit points. Starting 10 minutes after drinking, the user is POISONED for half an hour with no saves allowed.</p>",
        },
    },
    {
        name: "Surgical Kit",
        img: IMG,
        type: "gear",
        system: {
            category: "medical",
            bulk: 0,
            inPack: false,
            notes: "<p>Tools and drugs for performing surgery outside a medical facility. Disadvantage on Medicine checks for surgery normally performed in a medlab. 10 minutes of ministrations on an injured individual restores 1d8 HP.</p>",
        },
    },
    {
        name: "Trauma Patch",
        img: IMG,
        type: "gear",
        system: {
            category: "medical",
            bulk: 0,
            inPack: false,
            notes: "<p>Stabilizes a dying humanoid.</p>",
        },
    },
    {
        name: "Nano-Repair Kit",
        img: IMG,
        type: "gear",
        system: {
            category: "medical",
            bulk: 1,
            inPack: false,
            notes: "<p>Android medical equipment. An adhesive pack of Electronics Parts and Engineering Parts suspended in a nano-bot gel. Affixed to an injured android, heals 1d8+4 damage.</p>",
        },
    },
];

const folder = await Folder.create({ name: "Medical Gear", type: "Item" });
const created = await Item.createDocuments(items.map(d => ({ ...d, folder: folder.id })));
ui.notifications.info(`Created ${created.length} medical gear items in folder "${folder.name}".`);
