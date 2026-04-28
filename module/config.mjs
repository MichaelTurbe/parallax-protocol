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

PARALLAX.damageClasses = {
    kinetic: "Kinetic",
    energy: "Energy",
};

PARALLAX.kineticDamageTypes = {
    p: "Piercing",
    s: "Slashing",
    b: "Bludgeoning",
};

PARALLAX.energyDamageTypes = {
    f: "Fire",
    c: "Cold",
    a: "Acid",
    e: "Electrical",
};

PARALLAX.damageTypes = {
    ...PARALLAX.kineticDamageTypes,
    ...PARALLAX.energyDamageTypes,
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
