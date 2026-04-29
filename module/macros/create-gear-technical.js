const IMG = "systems/parallax-protocol/assets/icons/technical-equipment.svg";

const items = [
    {
        name: "Atmo-Analyzer",
        img: IMG,
        type: "gear",
        system: {
            category: "technical",
            bulk: 1,
            inPack: false,
            notes: "<p>Small sensor that interfaces with a comm device to identify the gas composition of atmosphere. Can detect airborne pathogens, inimical gasses, and measures environmental factors like pressure, temperature, and humidity.</p>",
        },
    },
    {
        name: "Bio-Analyzer",
        img: IMG,
        type: "gear",
        system: {
            category: "technical",
            bulk: 1,
            inPack: false,
            notes: "<p>Small sensor that interfaces with a comm device to identify pathogens, toxins, and allergens. Can determine the genetic make-up of organic material to identify a source species.</p>",
        },
    },
    {
        name: "Multi-Spectral Analyzer",
        img: IMG,
        type: "gear",
        system: {
            category: "technical",
            bulk: 1,
            inPack: false,
            notes: "<p>Small sensor that interfaces with a comm device to identify minerals, alloys, and artificial composites. Also detects radiation levels.</p>",
        },
    },
    {
        name: "Computer & Electronics Tools Field Kit",
        img: IMG,
        type: "gear",
        system: {
            category: "technical",
            bulk: 1,
            inPack: false,
            notes: "<p>Mobile tool bag with everything necessary to facilitate electronic repairs (also requires Electronics Parts). Can be used to dismantle physical devices for hacking or salvage.</p>",
        },
    },
    {
        name: "Engineering Tools Field Kit",
        img: IMG,
        type: "gear",
        system: {
            category: "technical",
            bulk: 2,
            inPack: false,
            notes: "<p>Mobile tool bag with everything necessary to facilitate repairs of repulsor and fusion devices, starships, demolition, and construction. Does not include spare parts.</p>",
        },
    },
];

const folder = await Folder.create({ name: "Technical Equipment", type: "Item" });
const created = await Item.createDocuments(items.map(d => ({ ...d, folder: folder.id })));
ui.notifications.info(`Created ${created.length} technical equipment items in folder "${folder.name}".`);
