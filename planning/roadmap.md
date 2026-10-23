# Roadmap

Last reviewed: 2026-10-22

## Built (as of 0.0.30)

**Actors**
- Character sheet (Application V2) with Dossier, Combat, Skills and Inventory tabs
- Stat block sheet for NPCs, robots and creatures, with skills you can add and remove
- Stat block importer that parses pasted stat block text into an actor
- NPC HP generated when a token is placed (average or rolled, set in world settings)

**Derived calculations (character)**
- Skill total bonus and target (bounded accuracy: bonus + target = 20)
- Save targets from CON, level, hereditary bonus (species traits) and armor/field save bonuses
- DR layers: body (species traits), armor, field, and total
- Load rating, bulk with and without pack, speed after armor penalty

**Rolls and chat**
- Skill checks and contests, saves, hit die, with advantage/disadvantage (3d10 keep 2)
- Weapon attacks as a check or a contest. With a token targeted, the chat card offers the defender's Evasion or Deflection, works out hit or miss (ties go to the defender), rolls damage, subtracts the matching DR, and has an "Apply damage" button
- Melee damage adds STR
- Burst/auto damage formulas
- Roll notification popups (configurable per client)

**Items**
- Weapon, armor, field generator, gear and species trait item types, all edited on one shared item sheet
- Item-creation macros for every equipment list in the rulebook, plus a macro that syncs world items into the compendium
- Item and actor compendium packs

## In progress: 0.1.0

See [releases/0.1.0.md](releases/0.1.0.md).

## To do

**Rules not yet modeled**
- Critical hits: a natural 20 on an attack should remind the user to reduce DR on the target's shield, then field, then armor. Optionally, track the damage on the item
- Kinetic and energy field generators cancel each other out. Currently only the first field item counts
- Resistance, vulnerability and immunity by damage type (halve, double, or zero the damage) in the damage chat flow
- Conditions (BURDENED, BURNING, DYING, FLANKED, PARALYZED, POISONED, PRONE, STUNNED, UNCONSCIOUS) as status effects, including automatic disadvantage where it applies
- Untrained skill tests (rank 0) suggesting or applying disadvantage
- Dying: coin flip and STABLE handling
- Automatic fire: spray against several targets, and jamming on a natural 2
- Species morphology beyond DR and saves (Small/Large load rating, Evasion bonus, resistances)
- Item bonuses to skills and saves from gear. These are typed in by hand now; they could come from item data
- An equipped/unequipped state for armor, fields and shields. Currently the first item of each type counts

**Sheet and UX**
- Level-up helper: roll HP and point out which categories still have advances left
- Character creation helper (stats 3/2/1/1, rank budgets)
- Show the hit die and priority on the dossier header

**Content**
- Re-sync the compendium after 0.1.0 so shields become `shield` items and the cloak and helmet text is updated
- Species trait compendium (morphological adaptations, exobiotic ecology traits)
- Finish the NPC and Terra-standard animal stat blocks to match the book

**Open questions**
- Should an armor DEX penalty be able to push effective DEX below 0? Currently there is no floor
- Should robot stat blocks hide save targets entirely?

**Housekeeping**
- The `restarting` commit on `master` still contains the 138 MB PDF, so `git push` will be rejected until that commit is rewritten
- `README.md` is out of date (says NPC sheets aren't implemented)
- `system.json` compatibility says verified 14.359; the local server runs 14.367
- `test.html` at the repo root: purpose unknown, candidate for removal
