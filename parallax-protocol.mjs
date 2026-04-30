import { PARALLAX } from "./module/config.mjs";
import { ParallaxActor } from "./module/documents/actor.mjs";
import { ParallaxItem } from "./module/documents/item.mjs";
import { ParallaxCharacterData } from "./module/data/actor/character-model.mjs";
import { ParallaxStatblockData } from "./module/data/actor/statblock-model.mjs";
import { ParallaxWeaponData } from "./module/data/item/weapon-model.mjs";
import { ParallaxArmorData } from "./module/data/item/armor-model.mjs";
import { ParallaxFieldData } from "./module/data/item/field-model.mjs";
import { ParallaxGearData } from "./module/data/item/gear-model.mjs";
import { ParallaxSpeciesTraitData } from "./module/data/item/species-trait-model.mjs";
import { ParallaxCharacterSheet } from "./module/sheets/actor-sheet.mjs";
import { ParallaxStatblockSheet } from "./module/sheets/statblock-sheet.mjs";
import { ParallaxItemSheet } from "./module/sheets/item-sheet.mjs";
import { rollWeaponDamage } from "./module/dice/rolls.mjs";
import { showRollToast } from "./module/ui/roll-toast.mjs";

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
        npc: ParallaxStatblockData,
        robot: ParallaxStatblockData,
        creature: ParallaxStatblockData,
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

    foundry.applications.apps.DocumentSheetConfig.registerSheet(Actor, "parallax-protocol", ParallaxStatblockSheet, {
        types: ["npc", "robot", "creature"],
        makeDefault: true,
        label: "Parallax Stat Block Sheet",
    });

    foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, "parallax-protocol", ParallaxItemSheet, {
        types: ["weapon", "armor", "field", "gear", "speciesTrait"],
        makeDefault: true,
        label: "Parallax Item Sheet",
    });
});

Hooks.on("createChatMessage", (message) => showRollToast(message));

Hooks.on("renderChatMessage", (message, html) => {
    const root = html instanceof HTMLElement ? html : html?.[0] ?? null;
    if (!(root instanceof HTMLElement)) return;

    root.querySelectorAll("[data-parallax-chat-action]").forEach((button) => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            const element = event.currentTarget;
            const action = element?.dataset?.parallaxChatAction;
            if (action !== "rollWeaponDamage") return;

            const actorUuid = element.dataset.actorUuid;
            const weaponId = element.dataset.weaponId;
            const damageMode = element.dataset.damageMode ?? "single";

            const actor = await fromUuid(actorUuid);
            const weapon = actor?.items?.get?.(weaponId);
            if (!actor || !weapon) {
                ui.notifications?.warn("Could not find the actor or weapon for this damage roll.");
                return;
            }

            await rollWeaponDamage(actor, weapon, damageMode);
        });
    });
});
