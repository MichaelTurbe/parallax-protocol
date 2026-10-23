# Decision log

Newest first. Each entry gives the decision, the reasoning, and anything it rules out.

---

## 2026-10-22: Decisions for 0.1.0 (rulebook 0.9.6.2 update)

**Skill ranks replace trained skill bonuses.**
Each skill stores a single number, `rank`, which feeds the total bonus directly: stat + rank + item bonus. The old fields (`trainedSkillBonus`, `frozenTrainedBonus`, the stored `trained` flag, and the actor-level `trainedSkillBonuses` table) are removed. A world migration copies `trainedSkillBonus` into `rank`, because the old free-entry value already worked like a rank.

**"Trained" is derived, not stored.**
The trained checkbox stays on the sheet but is disabled and follows `rank > 0`, as the 0.9.6.2 rules define it.

**Rank budgets warn but don't block.**
The skills tab shows ranks spent against the allowance for each category: creation ranks + (level − 1) × skills per level. At level 1 it also flags any skill over the per-skill creation maximum. Nothing stops the player from going over. Referees adjudicate, and players may be mid-edit.

**Priorities must be a permutation.**
Picking a category that another slot already has swaps the two slots, so each category always has exactly one priority. The hit die still follows the first priority.

**Priority rules live in config.**
`PARALLAX.priorityRules` holds creation ranks, the creation maximum, and skills per level for each priority. `PARALLAX.hitDieByCategory` holds the hit die for each category. Sheets and derived data read from these instead of keeping their own copies.

**Combat shields are their own item type.**
Shields now provide kinetic DR, so they join armor and field generators as a DR layer (`armorSummary.shield`), using the same "first item of this type counts" rule. Gear-typed shields in the compendium need to be re-synced; the sync macro now replaces items whose type changed.

**DEX penalties come from armor *and* field generators.**
The heavy field generators carry DEX and speed penalties in the rulebook table, so `field` items get `dexPenalty` and `speedPenalty` fields too. Effective DEX for skill math is DEX − (armor penalty + field penalty), with no floor. *Confirmed by the user 2026-10-22:* effective DEX can go below 0. Revisit after it has been tried in play.

**BURDENED speed penalties are calculated.**
The penalty is 5 ft per point of bulk above the load rating, worked out separately with and without the pack. Speed bottoms out at 0. The two manual penalty inputs are removed.

**Bulk is always a whole number.**
No item in the rules has fractional bulk (*user, 2026-10-22*), so every bulk field requires an integer and the item sheet inputs step by 1. The BURDENED math needs no rounding.

**Body DR comes only from species traits.**
The editable Body DR inputs are removed, because every recalculation overwrote them. Hereditary armor comes from species trait items.

**Initiative is 2d10 + Awareness.**
Both the combat tracker and the sheet's initiative button roll 2d10 + Awareness total bonus. The sheet button uses the selected advantage mode, and if the actor is in the active combat, it writes the result to the tracker.

**Repository hygiene.**
PDFs are ignored (the 0.9.6.2 rulebook is 138 MB, over GitHub's 100 MB limit). `CLAUDE.md` and `.claude/` are local-only.
