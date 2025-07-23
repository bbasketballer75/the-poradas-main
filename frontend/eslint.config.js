import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { ignores: ['dist/**', 'build/**', 'node_modules/**'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: '18.2',
      },
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      'react/react-in-jsx-scope': 'off', // Not needed with modern React/Vite
      'react/prop-types': 'off', // Optional: disable prop-types rule if not using them
    },
  },
];
