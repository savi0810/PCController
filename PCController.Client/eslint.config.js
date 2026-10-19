const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,

  {
    files: ['shared/PressBox.tsx', 'features/mouse/MousePad.tsx'],
    rules: {
      'react-hooks/refs': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
    },
  },

  {
    ignores: ['dist/*', '.expo/*'],
  },
]);
