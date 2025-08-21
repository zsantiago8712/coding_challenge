module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
    plugins: ['react', 'prettier'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                tabWidth: 4,
                useTabs: false,
                printWidth: 100,
                singleQuote: true,
                trailingComma: 'es5',
                semi: true,
            },
        ],
        indent: ['error', 4],
        'react/react-in-jsx-scope': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
