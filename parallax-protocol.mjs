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
import { showRollToast } from "./module/ui/roll-toast.mjs";
import { attachChatButtonListeners } from "./module/ui/chat-buttons.mjs";
import { StatblockImporter } from "./module/apps/statblock-importer.mjs";

Hooks.once("init", () => {
    console.log("Parallax Protocol | Initializing");

    game.settings.register('parallax-protocol', 'npcHpMode', {
        name: 'NPC Token HP Generation',
        hint: 'When a creature, NPC, or robot with no HP set is dropped onto the board, calculate starting HP using this method (level × hit die).',
        scope: 'world',
        config: true,
        type: String,
        choices: {
            'average': 'Average HP',
            'random': 'Roll random HP',
        },
        default: 'average',
    });

    game.settings.register('parallax-protocol', 'showRollToasts', {
        name: 'Show Roll Notifications',
        hint: 'Display a toast overlay when a roll result comes in. On by default for GMs, off by default for players.',
        scope: 'client',
        config: true,
        type: Boolean,
        default: game.user?.isGM ?? false,
    });

    game.settings.register('parallax-protocol', 'toastAutoClose', {
        name: 'Auto-dismiss Roll Toasts',
        hint: 'When enabled, roll result toasts close automatically after the configured delay. When disabled, they must be clicked to dismiss.',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
    });

    game.settings.register('parallax-protocol', 'toastDuration', {
        name: 'Roll Toast Duration (ms)',
        hint: 'How long roll result toasts stay visible before auto-dismissing. Has no effect if auto-dismiss is disabled.',
        scope: 'client',
        config: true,
        type: Number,
        default: 4500,
    });

    game.parallax = {
        config: PARALLAX,
        openStatblockImporter: () => new StatblockImporter().render(true),
    };

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
    attachChatButtonListeners(root);
});

Hooks.on("createToken", async (tokenDocument, _options, userId) => {
    if (userId !== game.userId) return;

    const actor = tokenDocument.actor;
    if (!actor || !["npc", "robot", "creature"].includes(actor.type)) return;
    if (actor.system.hp.value !== 0 || actor.system.hp.max !== 0) return;

    const dieStr = actor.system.summary?.hitDie ?? "D8";
    const sides = parseInt(dieStr.replace(/[Dd]/, ""), 10);
    const level = Math.max(1, Number(actor.system.summary?.level ?? 1));
    if (!Number.isFinite(sides) || sides < 2) return;

    const mode = game.settings.get("parallax-protocol", "npcHpMode");
    let hp;
    if (mode === "random") {
        const roll = await new Roll(`${level}d${sides}`).evaluate();
        hp = roll.total;
    } else {
        hp = (Math.floor(sides / 2) + 1) * level;
    }

    await tokenDocument.update({ "delta.system.hp.value": hp, "delta.system.hp.max": hp });
});

Hooks.on("renderActorDirectory", (_app, html) => {
    const root = html instanceof HTMLElement ? html : html?.[0];
    if (!(root instanceof HTMLElement)) return;
    if (root.querySelector(".pp-import-statblock-btn")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pp-import-statblock-btn";
    btn.textContent = "Import Stat Block";
    btn.addEventListener("click", () => new StatblockImporter().render(true));

    const target = root.querySelector(".header-actions")
        ?? root.querySelector(".directory-header")
        ?? root.querySelector("header");
    if (target) target.appendChild(btn);
});
