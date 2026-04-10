export const PARALLAX = {};

PARALLAX.skillCategories = {
    martial: "Martial",
    intellectual: "Intellectual",
    physical: "Physical",
    subtle: "Subtle",
};

PARALLAX.skills = {
    firearmsHeavy: { label: "Firearms - Heavy", category: "martial", stat: "str" },
    firearmsLong: { label: "Firearms - Long", category: "martial", stat: "wis" },
    firearmsSmall: { label: "Firearms - Small", category: "martial", stat: "dex" },
    grenades: { label: "Grenades", category: "martial", stat: "str" },
    gunnery: { label: "Gunnery", category: "martial", stat: "wis" },
    martialArts: { label: "Martial Arts", category: "martial", stat: "dex" },
    meleeWeapons: { label: "Melee Weapons", category: "martial", stat: "str" },

    astrogation: { label: "Astrogation", category: "intellectual", stat: "int" },
    chemistry: { label: "Chemistry", category: "intellectual", stat: "int" },
    computers: { label: "Computers", category: "intellectual", stat: "int" },
    cultures: { label: "Cultures", category: "intellectual", stat: "wis" },
    engineering: { label: "Engineering", category: "intellectual", stat: "int" },
    medicine: { label: "Medicine", category: "intellectual", stat: "wis" },
    starshipPiloting: { label: "Starship Piloting", category: "intellectual", stat: "wis" },

    acrobatics: { label: "Acrobatics", category: "physical", stat: "dex" },
    aircraftPiloting: { label: "Aircraft Piloting", category: "physical", stat: "dex" },
    animalHandling: { label: "Animal Handling", category: "physical", stat: "wis" },
    athletics: { label: "Athletics", category: "physical", stat: "str" },
    deflection: { label: "Deflection", category: "physical", stat: "str" },
    groundVehicles: { label: "Ground Vehicles", category: "physical", stat: "dex" },
    planetarySurvival: { label: "Planetary Survival", category: "physical", stat: "wis" },

    awareness: { label: "Awareness", category: "subtle", stat: "wis" },
    bureaucracy: { label: "Bureaucracy", category: "subtle", stat: "cha" },
    evasion: { label: "Evasion", category: "subtle", stat: "dex" },
    interrogation: { label: "Interrogation", category: "subtle", stat: "cha" },
    stealth: { label: "Stealth", category: "subtle", stat: "dex" },
    streetSmarts: { label: "Street Smarts", category: "subtle", stat: "cha" },
    trading: { label: "Trading", category: "subtle", stat: "cha" },
};

PARALLAX.saveTypes = {
    allergy: "Allergy",
    disease: "Disease",
    gas: "Gas",
    poison: "Poison",
    radiation: "Radiation",
    stun: "Stun",
};

PARALLAX.weaponClassifications = {
    melee: "Melee",
    smallArms: "Small Arms",
    longArms: "Long Arms",
    heavyArms: "Heavy Arms",
    grenade: "Grenade",
};

PARALLAX.damageTypes = {
    p: "Piercing",
    s: "Slashing",
    b: "Bludgeoning",
    f: "Fire",
    c: "Cold",
    a: "Acid",
    e: "Electrical",
};

PARALLAX.gearCategories = {
    combat: "Combat",
    comm: "Comm",
    infiltration: "Infiltration",
    medical: "Medical",
    mundane: "Mundane",
    parts: "Parts",
    survival: "Survival",
    technical: "Technical",
};

PARALLAX.priorityRanks = ["first", "second", "third", "fourth"];

PARALLAX.trainedSkillBonusByLevel = {
    1: { first: 4, second: 3, third: 2, fourth: 1 },
    2: { first: 5, second: 4, third: 3, fourth: 2 },
    3: { first: 6, second: 5, third: 4, fourth: 3 },
    4: { first: 7, second: 6, third: 5, fourth: 4 },
    5: { first: 8, second: 7, third: 6, fourth: 5 },
    6: { first: 9, second: 8, third: 7, fourth: 6 },
    7: { first: 10, second: 9, third: 8, fourth: 7 },
    8: { first: 11, second: 10, third: 9, fourth: 8 },
    9: { first: 12, second: 11, third: 10, fourth: 9 },
    10: { first: 13, second: 12, third: 11, fourth: 10 },
    11: { first: 14, second: 13, third: 12, fourth: 11 },
    12: { first: 15, second: 14, third: 13, fourth: 12 },
    13: { first: 16, second: 15, third: 14, fourth: 13 },
    14: { first: 17, second: 16, third: 15, fourth: 14 },
};
