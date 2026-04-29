const IMG = "systems/parallax-protocol/assets/icons/armor.svg";

const items = [
    {
        name: "Light Ship Suit",
        img: IMG,
        type: "armor",
        system: {
            bulk: 0,
            kineticDr: 0,
            energyDr: 1,
            dexPenalty: 0,
            speedPenalty: 0,
            notes: "<p>Radiation Save Bonus: +1.</p>",
        },
    },
    {
        name: "Light Ballistics Suit",
        img: IMG,
        type: "armor",
        system: {
            bulk: 0,
            kineticDr: 1,
            energyDr: 0,
            dexPenalty: 0,
            speedPenalty: 0,
            notes: "",
        },
    },
    {
        name: "Light Extravehicular Activity Suit",
        img: IMG,
        type: "armor",
        system: {
            bulk: 2,
            kineticDr: 1,
            energyDr: 2,
            dexPenalty: 1,
            speedPenalty: 5,
            notes: "<p>Radiation Save Bonus: +4. Stun Save Bonus: +2. Includes helmet &amp; atmo-canister. Vacuum safe.</p>",
        },
    },
    {
        name: "Medium Ship Suit",
        img: IMG,
        type: "armor",
        system: {
            bulk: 1,
            kineticDr: 1,
            energyDr: 1,
            dexPenalty: 0,
            speedPenalty: 0,
            notes: "<p>Radiation Save Bonus: +2. Stun Save Bonus: +1.</p>",
        },
    },
    {
        name: "Medium Combat Suit",
        img: IMG,
        type: "armor",
        system: {
            bulk: 2,
            kineticDr: 2,
            energyDr: 2,
            dexPenalty: 1,
            speedPenalty: 5,
            notes: "<p>Radiation Save Bonus: +2. Stun Save Bonus: +2.</p>",
        },
    },
    {
        name: "Medium Extravehicular Activity Suit",
        img: IMG,
        type: "armor",
        system: {
            bulk: 3,
            kineticDr: 2,
            energyDr: 3,
            dexPenalty: 2,
            speedPenalty: 10,
            notes: "<p>Radiation Save Bonus: +5. Stun Save Bonus: +3. Includes helmet &amp; atmo-canister. Vacuum safe.</p>",
        },
    },
    {
        name: "Heavy Combat Suit",
        img: IMG,
        type: "armor",
        system: {
            bulk: 3,
            kineticDr: 2,
            energyDr: 2,
            dexPenalty: 2,
            speedPenalty: 10,
            notes: "<p>Radiation Save Bonus: +3. Stun Save Bonus: +3.</p>",
        },
    },
    {
        name: "Heavy Combat Shell",
        img: IMG,
        type: "armor",
        system: {
            bulk: 4,
            kineticDr: 3,
            energyDr: 3,
            dexPenalty: 3,
            speedPenalty: 15,
            notes: "<p>Radiation Save Bonus: +3. Stun Save Bonus: +4. Includes helmet &amp; atmo-canister. Vacuum safe.</p>",
        },
    },
    {
        name: "Heavy Extravehicular Activity Suit",
        img: IMG,
        type: "armor",
        system: {
            bulk: 4,
            kineticDr: 3,
            energyDr: 4,
            dexPenalty: 3,
            speedPenalty: 15,
            notes: "<p>Radiation Save Bonus: +6. Stun Save Bonus: +4. Includes helmet &amp; atmo-canister. Includes propulsive pack. Self-healing to reasonable punctures. Vacuum safe.</p>",
        },
    },
    {
        name: "Power Combat Armor",
        img: IMG,
        type: "armor",
        system: {
            bulk: 1,
            kineticDr: 5,
            energyDr: 5,
            dexPenalty: 4,
            speedPenalty: 5,
            notes: "<p>Radiation Save Bonus: +4. Stun Save Bonus: +5. Includes helmet &amp; atmo-canister. Vacuum safe.</p>",
        },
    },
];

const folder = await Folder.create({ name: "Armor", type: "Item" });
const created = await Item.createDocuments(items.map(d => ({ ...d, folder: folder.id })));
ui.notifications.info(`Created ${created.length} armor items in folder "${folder.name}".`);
