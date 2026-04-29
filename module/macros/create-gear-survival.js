const IMG = "systems/parallax-protocol/assets/icons/survival.svg";

const items = [
    {
        name: "Atmo-Helmet",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 1,
            inPack: false,
            notes: "<p>Simple sealed helmet that attaches to any armor or space suit to provide breathable air via atmo-canisters.</p>",
        },
    },
    {
        name: "Light Atmo-Canister",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 0,
            inPack: false,
            notes: "<p>Provides 2 hours of an appropriate air mix for a humanoid. Attaches via hose to a sealed helmet.</p>",
        },
    },
    {
        name: "Medium Atmo-Canister",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 1,
            inPack: false,
            notes: "<p>Provides 4 hours of an appropriate air mix for a humanoid. Attaches via hose to a sealed helmet.</p>",
        },
    },
    {
        name: "Heavy Atmo-Canister",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 2,
            inPack: false,
            notes: "<p>Full backpack providing 12 hours of an appropriate air mix for a humanoid. Attaches via hose to a sealed helmet.</p>",
        },
    },
    {
        name: "Emergency Atmo-Field",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 0,
            inPack: false,
            notes: "<p>A collar that affixes to any type of armor. When activated, creates a gas-impermeable field around the wearer's head that preserves their breathable atmosphere for up to 10 minutes.</p>",
        },
    },
    {
        name: "Face Mask Rebreather",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 0,
            inPack: false,
            notes: "<p>Converts any non-corrosive atmospheric mix to one appropriate to the wearer.</p>",
        },
    },
    {
        name: "Comm Booster",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 2,
            inPack: false,
            notes: "<p>Powered, mobile satellite array with wired and wireless connectivity. Quadruples the range of a comm device in the absence of a datasphere.</p>",
        },
    },
    {
        name: "Proximity Alarm",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 1,
            inPack: false,
            notes: "<p>A set of nodes to surround a 20-foot diameter circle that warns of incursion. Multiple units can be strung together to increase the perimeter.</p>",
        },
    },
    {
        name: "Tactical Pack",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 1,
            inPack: false,
            notes: "<p>Reinforced backpack with hook-ups to handle connected combat accessories (cooling rigs and ammo feeders) and atmo-tubing for pluggable life support.</p>",
        },
    },
    {
        name: "Jet Pack",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 4,
            inPack: false,
            notes: "<p>A backpack-sized turbine jet propulsion system. Allows movement at 60 feet per round or 30 miles per hour. Has extendible winglets to control flight. Requires Aircraft Piloting skill to use effectively.</p>",
        },
    },
    {
        name: "Repulsor-Lift Belt",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 1,
            inPack: false,
            notes: "<p>Allows you to float sideways, one foot off the ground, at up to 30 feet per round. Does not allow hovering stationary or floating across an open gap.</p>",
        },
    },
    {
        name: "Weapon-Mounted Flood Light",
        img: IMG,
        type: "gear",
        system: {
            category: "survival",
            bulk: 1,
            inPack: false,
            notes: "<p>A flood light that mounts to a handheld weapon, providing illumination while aiming.</p>",
        },
    },
];

const folder = await Folder.create({ name: "Survival Gear", type: "Item" });
const created = await Item.createDocuments(items.map(d => ({ ...d, folder: folder.id })));
ui.notifications.info(`Created ${created.length} survival gear items in folder "${folder.name}".`);
