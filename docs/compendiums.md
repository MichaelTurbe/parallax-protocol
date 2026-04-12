# Compendiums for Parallax Protocol

## What to bundle

### Item compendium
Use this for:
- weapons
- armor
- field generators
- gear
- species traits, if you want reusable templates

### Actor compendium
Use this for:
- creatures
- NPCs
- robots
- premade templates and example opponents

## Practical authoring workflow

1. In your dev world, create a handful of test Items and Actors.
2. Create `items` and `actors` compendium packs in the Compendium tab.
3. Unlock the packs.
4. Drag Items and Actors into them.
5. Verify that opening the Item compendium and dragging an Item onto a character sheet creates an owned Item copy on the actor.
6. After you are happy with the content, copy the pack folders into this repo's `packs/` directory and add the `packs` entries to `system.json`.

## Why the repo marks packs as binary

LevelDB-backed compendia contain binary-ish files. Marking `packs/**` as binary in `.gitattributes` prevents line-ending conversion from corrupting them.
