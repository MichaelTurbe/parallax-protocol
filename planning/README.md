# Planning

This folder records what has been done to the Parallax Protocol Foundry system, why, and what is left. Use it to pick the project back up after time away.

| File | What it holds |
|------|---------------|
| [roadmap.md](roadmap.md) | Features that are built, in progress, and still to do. The living backlog. |
| [decisions.md](decisions.md) | A dated log of design decisions and the reasoning behind them. Append new entries at the top. |
| [releases/](releases/) | One file per system version: the plan for that release, a checklist of changes, and a short summary once it ships. |
| [rules/](rules/) | Notes on rulebook revisions: what changed between versions of the game and what that means for the code. |

## Conventions

- **Versioning.** The Foundry system version (`system.json`) is separate from the rulebook version. The system is at 0.x while it is a prototype. Bump the minor version (0.1.0 → 0.2.0) for changes that need a data migration, and the patch version for everything else.
- **Branches.** `master` is the stable line and `develop` is the integration branch. Work happens on `feature/<version>` branches cut from `develop`.
- **Keeping this current.** When a release branch finishes, tick off its items in its release file, move the finished features in `roadmap.md` to "Built", and log any decisions made along the way.
