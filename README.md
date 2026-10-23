# Parallax Protocol for Foundry VTT

A prototype Foundry VTT v14 game system for **Parallax Protocol**, a 2d10 sci-fi tabletop RPG by Ecstatic Entropy Games. This version tracks rulebook 0.9.6.2.

## What's included

- **Character sheet**: stats, skill ranks with per-category rank budgets, saves, DR layers (body, armor, field, shield), load and BURDENED speed, weapons, and inventory
- **Stat block sheet** for NPCs, robots and creatures, plus an importer for pasted stat block text
- **Item types**: weapon, armor, field generator, combat shield, gear, species trait
- **Rolls**: skill checks and contests, saves, initiative (2d10 + Awareness), hit die, and attack → defense → damage chat cards that subtract DR. All 2d10 rolls support advantage and disadvantage (3d10, keep 2)
- **Compendium packs** for items and actors, and macros to rebuild the item lists from the rulebook

## Status

This is a playable prototype, not a complete rules engine. See [`planning/roadmap.md`](planning/roadmap.md) for what's built and what's left, and [`planning/decisions.md`](planning/decisions.md) for the reasoning behind design choices.

## Development

There's no build step. This folder is the system folder inside Foundry's data path, so hard-reload the browser to pick up JS/CSS changes, and restart Foundry after changing `system.json`.
