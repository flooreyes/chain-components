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
      '@typescript-eslint/ban-ts-comment': 'off',
      'react/prop-types': 'off',
      'prettier/prettier': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off', 
      'react/no-unknow-property': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  };
  