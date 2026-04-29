const IMG = "systems/parallax-protocol/assets/icons/comm-device.svg";

const items = [
    {
        name: "Handheld Data Glance",
        img: IMG,
        type: "gear",
        system: {
            category: "comm",
            bulk: 0,
            inPack: false,
            notes: "<p>Voice &amp; video comms, vocal command. Range: 2 miles. Physical jack. Built-in VI optional.</p>",
        },
    },
    {
        name: "Boosted Handheld Data Glance",
        img: IMG,
        type: "gear",
        system: {
            category: "comm",
            bulk: 0,
            inPack: false,
            notes: "<p>Voice &amp; video comms, vocal command. Range: 4 miles. Physical jack. Built-in VI optional.</p>",
        },
    },
    {
        name: "In-Ear Mote",
        img: IMG,
        type: "gear",
        system: {
            category: "comm",
            bulk: 0,
            inPack: false,
            notes: "<p>Voice &amp; video comms, vocal command. Range: 1 mile. No physical jack. Built-in VI optional.</p>",
        },
    },
    {
        name: "Aural Implant",
        img: IMG,
        type: "gear",
        system: {
            category: "comm",
            bulk: 0,
            inPack: false,
            notes: "<p>Implanted device. Voice comms, vocal and subvocal command. Range: 1 mile. No physical jack. Built-in VI optional. Transmits audio directly to auditory nerve. Surgery required for installation (500 cr).</p>",
        },
    },
    {
        name: "Optic & Aural Implant",
        img: IMG,
        type: "gear",
        system: {
            category: "comm",
            bulk: 0,
            inPack: false,
            notes: "<p>Implanted device. Voice &amp; video comms (inbound or via paired device), vocal and subvocal command. Range: 2 miles. Physical jack optional. Built-in VI optional. Surgery required for installation (1000 cr).</p>",
        },
    },
    {
        name: "Boosted Optic & Aural Implant",
        img: IMG,
        type: "gear",
        system: {
            category: "comm",
            bulk: 0,
            inPack: false,
            notes: "<p>Implanted device. Voice &amp; video comms, vocal and subvocal command. Range: 4 miles. Physical jack optional. Built-in VI optional. Provides a +1 bonus to Computer tests. Surgery required for installation (1000 cr).</p>",
        },
    },
    {
        name: "Full Compute Slab",
        img: IMG,
        type: "gear",
        system: {
            category: "comm",
            bulk: 1,
            inPack: false,
            notes: "<p>Voice &amp; video comms, vocal command. Range: 5 miles. Physical jack. Built-in VI optional. Provides a +1 bonus to Computer tests.</p>",
        },
    },
    {
        name: "Hacker Slab",
        img: IMG,
        type: "gear",
        system: {
            category: "comm",
            bulk: 1,
            inPack: false,
            notes: "<p>Voice &amp; video comms, vocal command. Range: 10 miles. Physical jack. Built-in VI optional. Provides a +2 bonus to Computer tests.</p>",
        },
    },
];

const folder = await Folder.create({ name: "Comm Devices", type: "Item" });
const created = await Item.createDocuments(items.map(d => ({ ...d, folder: folder.id })));
ui.notifications.info(`Created ${created.length} comm device items in folder "${folder.name}".`);
