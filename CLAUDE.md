# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Foundry VTT v14 game system for **Parallax Protocol** (v0.9.5), a sci-fi tabletop RPG by Ecstatic Entropy Games. The full game rules are in `parallax-protocol-2d10-trade-rgb-9-5-lite.pdf` in this directory.

This is a prototype first-pass playable sheet. There is no build step, no test suite, and no package manager — all `.mjs` files are served directly by Foundry VTT as native ES modules.

## Development workflow

This directory **is** the system folder inside Foundry's data path (`Data/systems/parallax-protocol`). To test changes:

1. Start Foundry VTT (the desktop app or `node resources/app/main.js` from the Foundry installation directory).
2. Open or create a world that uses the Parallax Protocol system.
3. Hard-reload the browser (`Cmd+Shift+R`) to pick up JS/CSS changes.
4. For `system.json` or module registration changes, fully restart Foundry.

There is no linter or formatter configured. The codebase uses 4-space indentation and single quotes in JS.

## Architecture

### Entry point

`parallax-protocol.mjs` — runs on the `init` Foundry hook. Registers document classes, data models, and sheets. Also wires the `renderChatMessage` hook for the inline damage-roll buttons in attack chat cards.

### Module layout

| Path | Purpose |
|------|---------|
| `module/config.mjs` | `PARALLAX` constant — all enumerated game data (skills, saves, weapon/damage/gear classifications, priority ranks). Single source of truth for labels and category/stat mappings. |
| `module/documents/actor.mjs` | `ParallaxActor` — extends `Actor`. All derived data calculations live here: skills, saves, load, movement, DR, and combat stats. |
| `module/documents/item.mjs` | `ParallaxItem` — extends `Item`. Only used to coerce `damageType` to a valid value for the weapon's `damageClass`. |
| `module/data/actor/character-model.mjs` | `ParallaxCharacterData` — `TypeDataModel` schema for `character` actors. |
| `module/data/actor/statblock-model.mjs` | `ParallaxStatblockData` — `TypeDataModel` schema shared by `npc`, `robot`, and `creature` actors. |
| `module/data/item/*.mjs` | `TypeDataModel` schemas for each item type: weapon, armor, field, gear, speciesTrait. |
| `module/sheets/actor-sheet.mjs` | `ParallaxCharacterSheet` — Application V2 sheet for `character` actors. Handles all UI actions via `data-pp-action` attributes. |
| `module/sheets/statblock-sheet.mjs` | `ParallaxStatblockSheet` — Application V2 sheet for NPC/robot/creature actors. Supports dynamically adding/removing skills. |
| `module/sheets/item-sheet.mjs` | `ParallaxItemSheet` — single sheet for all item types; uses `isWeapon`/`isArmor`/etc. flags in context to show type-specific fields. |
| `module/dice/rolls.mjs` | All roll functions: `rollSkillCheck`, `rollSkillContest`, `rollSave`, `rollInitiative`, `rollWeaponAttack`, `rollWeaponDamage`, `rollHitDie`. |
| `templates/` | Handlebars templates for actor and item sheets. |
| `styles/system.css` | All CSS. |
| `lang/en.json` | Localization strings (minimal — just type labels). |

### UI interaction pattern

Both actor sheets use `data-pp-action` attributes on clickable elements. The `_onClickAction` handler in each sheet routes to the appropriate function. Roll mode (normal/advantage/disadvantage) is stored as `_rollMode` on the sheet instance and resets to `"normal"` after each roll. Scroll position is captured before any update and restored after `render()` to prevent the sheet from jumping.

The item sheet stores a `_parentSheet` reference when opened from an actor sheet, and triggers a debounced re-render of the parent (150ms) on input change and on close.

### Compendium packs

The `packs/` directory is reserved for LevelDB-backed compendium folders created by Foundry. See `docs/compendiums.md` for the authoring workflow. Pack entries must be added to `system.json` manually after the folders are created in Foundry.

---

## Game rules reference

### Core resolution mechanic

All skill tests and saving throws roll **2d10** (add both dice). Roll equal to or above the target number to succeed.

- **Normal roll**: `2d10`
- **Advantage**: `3d10kh2` (roll 3, keep highest 2)
- **Disadvantage**: `3d10kl2` (roll 3, keep lowest 2)

Advantage and disadvantage do not stack. If both apply, the roll is normal.

**Bounded accuracy**: Every skill's `totalBonus + skillTarget = 20`. As bonus increases, target decreases by the same amount.

### Stats

Six stats stored as direct bonuses (not scores): **STR, DEX, CON, INT, WIS, CHA**. Assigned at creation as `3, 2, 1, 1` distributed among four of the six.

### Skills

28 skills in four categories, each linked to a stat:

| Category | Skills (stat) |
|----------|--------------|
| **Martial** | Firearms - Heavy (STR), Firearms - Long (WIS), Firearms - Small (DEX), Grenades (STR), Gunnery (WIS), Martial Arts (DEX), Melee Weapons (STR) |
| **Intellectual** | Astrogation (INT), Chemistry (INT), Computers (INT), Cultures (WIS), Engineering (INT), Medicine (WIS), Starship Piloting (WIS) |
| **Physical** | Acrobatics (DEX), Aircraft Piloting (DEX), Animal Handling (WIS), Athletics (STR), Deflection (STR), Ground Vehicles (DEX), Planetary Survival (WIS) |
| **Subtle** | Awareness (WIS), Bureaucracy (CHA), Evasion (DEX), Interrogation (CHA), Stealth (DEX), Street Smarts (CHA), Trading (CHA) |

**Total skill bonus** = stat bonus + trained skill bonus + item bonus

**Skill target** = 20 − total skill bonus

- **Skill Check** (no opponent): roll 2d10 ≥ skill target
- **Skill Contest** (opposed): roll 2d10 + total skill bonus; higher total wins; ties go to the defender
- Untrained skill tests have disadvantage (at referee's discretion)

### Priority system

Characters rank the four skill categories **first / second / third / fourth**. This sets:

1. **Hit die**: Martial → d10, Intellectual → d6, Physical → d12, Subtle → d8
2. **Initial trained skill bonus** at character creation: first → 4, second → 3, third → 2, fourth → 1
3. **Skills advanced per level**: first → 4 skills, second → 3, third → 2, fourth → 1

Changing `system.priorities.first` in the sheet automatically updates `system.identity.hitDie`.

The `trained` checkbox on skills is a marker only — it does **not** gate or change the bonus calculation. `trainedSkillBonus` is a free-entry field.

### Saving throws

Six save types: **Allergy, Disease, Gas, Poison, Radiation, Stun**

**Save target** = 20 − CON bonus − level − hereditary bonus − item bonus

Saving throws improve automatically each level (level is subtracted). The `hereditaryBonus` per save type is overridden from equipped `speciesTrait` items during `prepareDerivedData`.

### Hit points

- First level: max hit die sides + CON bonus
- Each subsequent level: roll hit die + CON bonus

### Character creation steps

1. Choose species (record hereditary armor and save bonuses from speciesTrait items)
2. Assign attribute bonuses: 3, 2, 1, 1 to four stats
3. Prioritize skill categories (first/second/third/fourth)
4. Record hit die (from first priority)
5. Choose trained skills (per category, based on priority order)
6. Choose a signature item (up to 500 cr, free)
7. Buy starting gear (100 cr budget)
8. Record starting HP = hit die max + CON bonus
9. Fill in armor, DR, speed penalties
10. Calculate all skill bonuses/targets and save targets

### Leveling up

- Roll hit die + CON bonus for new HP
- Advance skills: improve `trainedSkillBonus` by 1 for the number of skills allowed per category priority
- Update all skill targets and save targets (save targets improve automatically since level is part of the formula)

Experience is session-based (or milestone, at referee's choice).

### Combat

**Initiative**: `1d20 + Awareness total skill bonus`. Determined once at start of combat; descending order.

**Turn structure**: Each combatant gets one **Move** + one **Action** (attack, significant gear interaction, or second move). Movement can be split around the action.

**Ranged attack**: Attacker's relevant firearms skill contest vs. target's Evasion. Higher total wins; ties go to defender. Against unaware targets: skill check with advantage (no contest).

**Melee attack**: Attacker's Melee Weapons (or Martial Arts) contest vs. defender's choice of Evasion or Deflection. Against unaware targets: automatic hit.

**Melee damage**: Always adds STR bonus to single-hit damage.

**Critical hit** (natural 20): Permanently reduces DR of one armor implement by 1 (fields first, then armor). Does not affect robots or hereditary armor.

**Death**: At 0 HP, character acquires DYING condition (unconscious, prone). Flip a coin at end of following round — failure = dead, success = STABLE. A Medicine check or healing tech also stabilizes.

### Damage types

- **Kinetic**: Piercing (P), Slashing (S), Bludgeoning (B)
- **Energy**: Fire (F), Cold (C), Acid (A), Electrical (E)

**Damage reduction (DR)**: Kinetic DR and Energy DR are tracked separately. Final damage = attack damage − applicable DR.

**Resistance**: Half damage. **Vulnerability**: Double damage. **Immunity**: No damage.

### DR sources (stacked)

1. **Body** (hereditary, from speciesTrait items): `armorSummary.body.kinetic/energy`
2. **Worn armor** (first armor item): `armorSummary.armor.kinetic/energy`
3. **Field generator** (first field item): `armorSummary.field.kinetic/energy`

Kinetic and energy field generators are mutually exclusive — equipping both cancels both.

### Load and encumbrance

**Load rating** = 5 + STR bonus

Gear bulk is tracked with/without pack:
- Weapons always count as "not in pack"
- Gear items have an `inPack` boolean

If total bulk exceeds load rating → **BURDENED**: speed −5 ft per bulk above rating until unable to move.

### Automatic fire

Weapons with a `damageAutomatic` formula can:
- **Burst** (semi-auto): attack single target, use burst damage on hit
- **Spray** (full auto): conical area equal to short range, single attack roll with disadvantage; each target makes opposed Evasion or is hit on a skill check if unaware

Rolling a natural 2 on burst/spray causes overheat/jam unless connected to an auto-feed & cooling rig.

### Conditions

| Condition | Effect |
|-----------|--------|
| BURDENED | Speed −5 ft per bulk above load rating |
| BURNING | 2d6 damage/round until extinguished |
| DYING | Unconscious + prone; coin flip each round (fail = dead, success = STABLE) |
| FLANKED | Disadvantage on Evasion/Deflection even vs. ranged |
| PARALYZED | Conscious but immobile; cannot take actions |
| POISONED | Disadvantage on all skill tests and saves |
| PRONE | Disadvantage on Evasion/Deflection contests and attack rolls; 15 ft of movement to stand |
| STUNNED | Cannot move or act; save each minute to recover |
| UNCONSCIOUS | Unaware; cannot move or act |

### Weapons (key system facts)

**Attack bonus mode**: `"linked"` pulls from the weapon's linked skill total bonus; `"manual"` uses a manually entered value.

**Weapon classifications** and their linked skills:
- Melee → Melee Weapons (STR damage bonus added)
- Small Arms → Firearms - Small
- Long Arms → Firearms - Long
- Heavy Arms → Firearms - Heavy
- Grenade → Grenades

**Weapon damage classes**: Kinetic (P/S/B) or Energy (F/C/A/E). `ParallaxItem.prepareBaseData()` coerces `damageType` to a valid value for the active `damageClass`.

### Armor system

Armor provides kinetic and energy DR, plus optional DEX penalty (reduces DEX bonus for skill calculations) and speed penalty. Only the first equipped armor item and first equipped field item contribute to DR.

Shields provide a bonus to Deflection/Evasion skill contests (not DR), and can be dropped freely.

### Statblocks (NPC / Robot / Creature)

Use `ParallaxStatblockData`. Core skills are always Awareness, Deflection, and Evasion. Additional skills can be added dynamically in the sheet. Skill target = `20 − bonus`. All saves use a single `summary.saveTarget` field.

**Creature save target formula**: `20 − level − 2`

**Robot save targets**: Usually omitted (robots are immune to most save effects).

**Statblock skill formulas by archetype** (level-relative):

*Martial creature*: Melee Weapons = level+6, Evasion = level+2, Deflection = level+3

*Physical creature*: Melee Weapons = level+4, Deflection = level+3, Evasion = level+2

*Subtle creature*: Melee Weapons = level+3, Evasion = level+4, Stealth = level+4

*Intellectual creature*: Evasion = level+3, Awareness = level+3, Stealth = level+3

### Organic sophonts (species traits)

Species traits contribute:
- Hereditary armor (kinetic and/or energy DR bonus to `body` layer)
- Save bonuses per type
- Miscellaneous morphological attributes (tracked in notes — not yet modeled mechanically beyond DR and saves)

Key morphological attributes from the rules (reference for future implementation):
- **Small**: Load rating = 4+STR; +2 Evasion bonus; cannot wield heavy weapons unmounted
- **Large**: Load rating = 6+STR
- **Dermal armor**: Innate kinetic DR 1, resistance to bludgeoning
- **Exoskeleton**: Innate kinetic DR 1 and energy DR 1
- **Scaled**: Innate kinetic DR 1, resistance to piercing

### Starships and travel

The system does not implement starship combat. Travel uses a hex-map model:
- Jump up to 3 hexes per FTL jump; Astrogation skill check (advantage at 1 hex, normal at 2, disadvantage at 3)
- Jump drive ratings (1/2/3) determine in-system travel time (1d6/1d4/1d2 days) and FTL time per hex
- Fuel cost and provisioning costs are tracked economically (not yet implemented in the VTT system)
