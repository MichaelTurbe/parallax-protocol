Utilities, simulators, and generators for the Parallax Protocol tabletop roleplaying game.

tsx￼ is a newer, faster alternative to ts-node, powered by esbuild.
It runs TypeScript, ESM, JSX, etc., instantly — no precompile step, no config headaches.
Install it:
npm install --save-dev tsx

Run your project:
npx tsx src/index.ts

For watch mode (auto-reload):
npx tsx watch src/main.ts

tsx automatically handles:
• "module": "NodeNext"
• .ts and .mts extensions
• TypeScript path aliases
• ESM import quirks
— all without you changing your imports or enabling allowImportingTsExtensions.
