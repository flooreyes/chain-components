module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
      'react',
      'react-hooks',
      'prettier'
    ],
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier'
    ],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      'react/prop-types': 'off',
      'prettier/prettier': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  };
  