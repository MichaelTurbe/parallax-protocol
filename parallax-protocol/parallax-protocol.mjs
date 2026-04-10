import { PARALLAX } from "./module/config.mjs";
import { ParallaxActor } from "./module/documents/actor.mjs";
import { ParallaxItem } from "./module/documents/item.mjs";
import { ParallaxCharacterData } from "./module/data/actor/character-model.mjs";
import { ParallaxWeaponData } from "./module/data/item/weapon-model.mjs";
import { ParallaxArmorData } from "./module/data/item/armor-model.mjs";
import { ParallaxFieldData } from "./module/data/item/field-model.mjs";
import { ParallaxGearData } from "./module/data/item/gear-model.mjs";
import { ParallaxSpeciesTraitData } from "./module/data/item/species-trait-model.mjs";
import { ParallaxCharacterSheet } from "./module/sheets/actor-sheet.mjs";
import { ParallaxItemSheet } from "./module/sheets/item-sheet.mjs";

Hooks.once("init", () => {
    console.log("Parallax Protocol | Initializing");

    game.parallax = { config: PARALLAX };

    Handlebars.registerHelper("eq", function (a, b) {
        return a === b;
    });

    CONFIG.Actor.documentClass = ParallaxActor;
    CONFIG.Item.documentClass = ParallaxItem;

    CONFIG.Actor.dataModels = {
        character: ParallaxCharacterData,
    };

    CONFIG.Item.dataModels = {
        weapon: ParallaxWeaponData,
        armor: ParallaxArmorData,
        field: ParallaxFieldData,
        gear: ParallaxGearData,
        speciesTrait: ParallaxSpeciesTraitData,
    };

    foundry.applications.apps.DocumentSheetConfig.registerSheet(Actor, "parallax-protocol", ParallaxCharacterSheet, {
        types: ["character"],
        makeDefault: true,
        label: "Parallax Character Sheet",
    });

    foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, "parallax-protocol", ParallaxItemSheet, {
        types: ["weapon", "armor", "field", "gear", "speciesTrait"],
        makeDefault: true,
        label: "Parallax Item Sheet",
    });
});
