const IMG = "systems/parallax-protocol/assets/icons/drone.svg";

const items = [
    {
        name: "Manual Airborne Drone",
        img: IMG,
        type: "gear",
        system: {
            category: "technical",
            bulk: 1,
            inPack: false,
            notes: "<p>Fan-driven, mechanically lifted surveillance drone with basic video and networking. Requires an active comm device for control. Speed: 30 feet.</p>",
        },
    },
    {
        name: "Autonomous Airborne Drone",
        img: IMG,
        type: "gear",
        system: {
            category: "technical",
            bulk: 1,
            inPack: false,
            notes: "<p>Fan-driven, mechanically lifted autonomous drone with a limited VI. Can accept natural language commands and interface with any comm device for remote vision and control. Speed: 30 feet.</p>",
        },
    },
    {
        name: "Contra-Grav Drone",
        img: IMG,
        type: "gear",
        system: {
            category: "technical",
            bulk: 1,
            inPack: false,
            notes: "<p>Lightweight repulsor-lifted drone with an autonomous VI. Interfaces with any comm device for remote vision and voice communication. Speed: 20 feet.</p>",
        },
    },
    {
        name: "Light Combat Drone",
        img: IMG,
        type: "gear",
        system: {
            category: "technical",
            bulk: 1,
            inPack: false,
            notes: "<p>Lightweight repulsor-lifted combat drone with an autonomous VI. Built-in weapon equivalent to an arc pistol. Interfaces with any comm device for remote vision and voice communication. See stat block. Speed: 25 feet. Level 1, d4 hit die. Arc Pistol: +5, 1d6 energy (E). Evasion: +7, Deflection: +0. Kinetic DR: 0, Energy DR: 1. Stealth: +8/18.</p>",
        },
    },
    {
        name: "Medium Combat Drone",
        img: IMG,
        type: "gear",
        system: {
            category: "technical",
            bulk: 1,
            inPack: false,
            notes: "<p>Medium-weight repulsor-lifted combat drone with an autonomous VI. Built-in weapons: laser pistol and stun pistol. Includes infrared vision. Interfaces with any comm device for remote vision and voice communication. See stat block. Speed: 30 feet. Level 3, d6 hit die. Laser Pistol: +7, 1d6 energy (F). Evasion: +7, Deflection: +3. Kinetic DR: 2, Energy DR: 3. Stealth: +4/16.</p>",
        },
    },
    {
        name: "Heavy Combat Drone",
        img: IMG,
        type: "gear",
        system: {
            category: "technical",
            bulk: 1,
            inPack: false,
            notes: "<p>Heavy assault repulsor-lifted combat drone with an autonomous VI. Built-in weapons: laser rifle and stun rifle. Includes infrared vision, kinetic shielding, and energy field generator. Interfaces with any comm device for remote vision and voice communication. See stat block. Speed: 30 feet. Level 6, d8 hit die. Laser Pistol: +9, 1d8 energy (F). Stun Pistol: +9, 1d8 energy (E). Evasion: +5, Deflection: +7. Kinetic DR: 4, Energy DR: 6. Stealth: +2/18.</p>",
        },
    },
];

const folder = await Folder.create({ name: "Drones", type: "Item" });
const created = await Item.createDocuments(items.map(d => ({ ...d, folder: folder.id })));
ui.notifications.info(`Created ${created.length} drone items in folder "${folder.name}".`);
