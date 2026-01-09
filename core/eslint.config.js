// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
    { ignores: ['dist/**', 'node_modules/**'] },

    // Base JS
    js.configs.recommended,

    // TS baseline (non type-aware)
    ...tseslint.configs.recommended,

    // Your project TS rules (plugin must be declared here if rules use it)
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.node,
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin, // <-- define plugin here
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
        },
    }
);
