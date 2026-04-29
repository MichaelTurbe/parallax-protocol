const IMG = "systems/parallax-protocol/assets/icons/parts.svg";

const items = [
    {
        name: "Advanced Engineering Parts",
        img: IMG,
        type: "gear",
        system: {
            category: "parts",
            bulk: 3,
            inPack: false,
            notes: "<p>Advanced components common to fusion reactors, fusion drives, gravitic generators, field generators, androids, and other complex modern technologies. Can be used to repair such devices with an Engineering skill test. Scavenging such devices with Engineering Tools can extract one unit.</p>",
        },
    },
    {
        name: "Analog Construction Materials",
        img: IMG,
        type: "gear",
        system: {
            category: "parts",
            bulk: 3,
            inPack: false,
            notes: "<p>Polymers, compounds, and alloys used in structural fabrication. Personal armors and shields are made of such materials. Can be used to repair structures with an Engineering skill test. Scavenging large assemblies with Engineering Tools can extract one unit.</p>",
        },
    },
    {
        name: "Electronics Parts",
        img: IMG,
        type: "gear",
        system: {
            category: "parts",
            bulk: 1,
            inPack: false,
            notes: "<p>Components of computers, robots, comm devices, and most modern electronic hardware. Can be used to repair such devices with a Computers skill test. Scavenging such devices with Electronics Tools can extract one unit.</p>",
        },
    },
    {
        name: "Engineering Parts",
        img: IMG,
        type: "gear",
        system: {
            category: "parts",
            bulk: 2,
            inPack: false,
            notes: "<p>Components of energy weapons, shield generators, and most common machinery. Can be used to repair such devices with an Engineering skill test. Scavenging such devices can produce one unit.</p>",
        },
    },
];

const folder = await Folder.create({ name: "Parts", type: "Item" });
const created = await Item.createDocuments(items.map(d => ({ ...d, folder: folder.id })));
ui.notifications.info(`Created ${created.length} parts items in folder "${folder.name}".`);
