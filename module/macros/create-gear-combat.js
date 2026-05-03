const IMG = "systems/parallax-protocol/assets/icons/combat-accessories.svg";

const items = [
    {
        name: "Light Kinetic Shield",
        img: IMG,
        type: "gear",
        system: {
            category: "combat",
            bulk: 2,
            inPack: false,
            price: 10,
            notes: "<p>A rigid hand-held shield. Provides a +1 item bonus to DEFLECTION and EVASION skill contests. Can be dropped at any time without requiring an action. Can be attached to a backpack when not in use.</p>",
        },
    },
    {
        name: "Medium Kinetic Shield",
        img: IMG,
        type: "gear",
        system: {
            category: "combat",
            bulk: 3,
            inPack: false,
            price: 20,
            notes: "<p>A rigid hand-held shield. Provides a +2 item bonus to DEFLECTION and EVASION skill contests. Can be dropped at any time without requiring an action. Can be attached to a backpack when not in use.</p>",
        },
    },
    {
        name: "Heavy Kinetic Shield",
        img: IMG,
        type: "gear",
        system: {
            category: "combat",
            bulk: 4,
            inPack: false,
            price: 40,
            notes: "<p>A rigid hand-held shield. Provides a +3 item bonus to DEFLECTION and EVASION skill contests. Can be dropped at any time without requiring an action. Can be attached to a backpack when not in use.</p>",
        },
    },
    {
        name: "DNA Lock",
        img: IMG,
        type: "gear",
        system: {
            category: "combat",
            bulk: 0,
            inPack: false,
            price: 200,
            notes: "<p>Connects to any weapon requiring activation or triggering to ensure that no one else can pick it up and use it.</p>",
        },
    },
    {
        name: "Laser Energy Sink & Cooling Rig",
        img: IMG,
        type: "gear",
        system: {
            category: "combat",
            bulk: 2,
            inPack: false,
            price: 450,
            notes: "<p>A foot-cubic device stored in a backpack and connected via tubes to an automatic laser weapon. Lifts the burst limit per combat and removes the possibility of overheating on a roll of 2. Effectively stops you from dropping the gun. Connection/disconnect requires a round.</p>",
        },
    },
    {
        name: "Mag Auto-Feed & Cooling Rig",
        img: IMG,
        type: "gear",
        system: {
            category: "combat",
            bulk: 2,
            inPack: false,
            price: 450,
            notes: "<p>A foot-cubic device stored in a backpack and connected via metal tubes to an automatic mag weapon. Lifts the burst limit per combat and removes the possibility of overheating on a roll of 2. Effectively stops you from dropping the gun. Connection/disconnect requires a round.</p>",
        },
    },
    {
        name: "Slug Auto-Feed & Cooling Rig",
        img: IMG,
        type: "gear",
        system: {
            category: "combat",
            bulk: 2,
            inPack: false,
            price: 450,
            notes: "<p>A foot-cubic device stored in a backpack and connected via metal tubes to an automatic slug weapon. Lifts the burst limit per combat and removes the possibility of overheating on a roll of 2. Effectively stops you from dropping the gun. Connection/disconnect requires a round.</p>",
        },
    },
    {
        name: "Tactical Helmet",
        img: IMG,
        type: "gear",
        system: {
            category: "combat",
            bulk: 1,
            inPack: false,
            price: 800,
            notes: "<p>Combines visual targeting aids with the benefits of an optic &amp; aural comm implant via visual overlays and in-helmet audio. Provides a +1 to attacks with LONG ARMS and to GUNNERY checks if interfaced with a ship's systems. Auto-dims visor — immune to BLINDED by flashes. Not vacuum-rated, but filters provide a +10 to GAS saving throws. Must be charged occasionally.</p>",
        },
    },
];

const folder = await Folder.create({ name: "Combat Accessories", type: "Item" });
const created = await Item.createDocuments(items.map(d => ({ ...d, folder: folder.id })));
ui.notifications.info(`Created ${created.length} combat accessory items in folder "${folder.name}".`);
