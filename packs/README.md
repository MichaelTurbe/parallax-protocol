# Bundled Compendium Workflow

This directory is reserved for bundled compendium packs that ship with the Parallax Protocol system.

## Recommended pack layout

- `packs/items/` — Item compendium for weapons, armor, fields, gear, and other system items
- `packs/actors/` — Actor compendium for NPCs, creatures, and robots

## Important note

Foundry VTT v11+ stores each compendium pack as a folder-backed database. Those pack folders are created and maintained by Foundry itself.

Because of that, the safest workflow is:

1. Run the system in a local development world.
2. Create the compendium pack in Foundry's Compendium Directory.
3. Populate it by dragging documents into the pack or exporting a folder to the pack.
4. Close Foundry.
5. Copy the generated pack folder into this `packs/` directory in the repo.
6. Add the pack metadata to `system.json` once the real folders exist.

## Suggested manifest entries

```json
"packs": [
  {
    "name": "items",
    "label": "Parallax Items",
    "system": "parallax-protocol",
    "path": "./packs/items",
    "type": "Item",
    "ownership": {
      "PLAYER": "OBSERVER",
      "TRUSTED": "OBSERVER",
      "ASSISTANT": "OWNER"
    }
  },
  {
    "name": "actors",
    "label": "Parallax NPCs & Creatures",
    "system": "parallax-protocol",
    "path": "./packs/actors",
    "type": "Actor",
    "ownership": {
      "PLAYER": "OBSERVER",
      "TRUSTED": "OBSERVER",
      "ASSISTANT": "OWNER"
    }
  }
]
```

## Drag and drop

Once your bundled Item compendium exists, Items dragged from that compendium onto a character sheet should become owned Items on the Actor, assuming the Actor sheet accepts dropped Items.
