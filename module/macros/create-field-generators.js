const IMG = "systems/parallax-protocol/assets/icons/field.svg";

const items = [
    {
        name: "Light Energy Field Generator",
        img: IMG,
        type: "field",
        system: {
            bulk: 0,
            kineticDr: 0,
            energyDr: 1,
            saveBonuses: { radiation: 0, stun: 1 },
            notes: "<p>Worn on wrist (always over clothes and armor). Kinetic and energy fields are mutually exclusive — equipping both cancels both.</p>",
        },
    },
    {
        name: "Light Kinetic Field Generator",
        img: IMG,
        type: "field",
        system: {
            bulk: 0,
            kineticDr: 1,
            energyDr: 0,
            saveBonuses: { radiation: 0, stun: 0 },
            notes: "<p>Worn on wrist (always over clothes and armor). Kinetic and energy fields are mutually exclusive — equipping both cancels both.</p>",
        },
    },
    {
        name: "Medium Energy Field Generator",
        img: IMG,
        type: "field",
        system: {
            bulk: 0,
            kineticDr: 0,
            energyDr: 2,
            saveBonuses: { radiation: 1, stun: 2 },
            notes: "<p>Worn as a belt. Kinetic and energy fields are mutually exclusive — equipping both cancels both.</p>",
        },
    },
    {
        name: "Medium Kinetic Field Generator",
        img: IMG,
        type: "field",
        system: {
            bulk: 0,
            kineticDr: 2,
            energyDr: 0,
            saveBonuses: { radiation: 0, stun: 0 },
            notes: "<p>Worn as a belt. Kinetic and energy fields are mutually exclusive — equipping both cancels both.</p>",
        },
    },
    {
        name: "Heavy Energy Field Generator",
        img: IMG,
        type: "field",
        system: {
            bulk: 1,
            kineticDr: 0,
            energyDr: 3,
            saveBonuses: { radiation: 2, stun: 3 },
            notes: "<p>DEX Penalty: 1. Worn as a backpack. Precludes other backpacks unless wearing powered armor. Kinetic and energy fields are mutually exclusive — equipping both cancels both.</p>",
        },
    },
    {
        name: "Heavy Kinetic Field Generator",
        img: IMG,
        type: "field",
        system: {
            bulk: 1,
            kineticDr: 3,
            energyDr: 0,
            saveBonuses: { radiation: 0, stun: 0 },
            notes: "<p>DEX Penalty: 3. Speed Penalty: 15 ft. Worn as a backpack. Precludes other backpacks unless wearing powered armor. Kinetic and energy fields are mutually exclusive — equipping both cancels both.</p>",
        },
    },
    {
        name: "Power Kinetic Field Generator",
        img: IMG,
        type: "field",
        system: {
            bulk: 2,
            kineticDr: 4,
            energyDr: 0,
            saveBonuses: { radiation: 0, stun: 0 },
            notes: "<p>Worn as a backpack. Precludes other backpacks unless wearing powered armor. Kinetic and energy fields are mutually exclusive — equipping both cancels both.</p>",
        },
    },
    {
        name: "Power Energy Field Generator",
        img: IMG,
        type: "field",
        system: {
            bulk: 2,
            kineticDr: 0,
            energyDr: 4,
            saveBonuses: { radiation: 3, stun: 4 },
            notes: "<p>Worn as a backpack. Precludes other backpacks unless wearing powered armor. Kinetic and energy fields are mutually exclusive — equipping both cancels both.</p>",
        },
    },
];

const folder = await Folder.create({ name: "Field Generators", type: "Item" });
const created = await Item.createDocuments(items.map(d => ({ ...d, folder: folder.id })));
ui.notifications.info(`Created ${created.length} field generator items in folder "${folder.name}".`);
