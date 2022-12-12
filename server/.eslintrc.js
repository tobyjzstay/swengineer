module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    parser: "@babel/eslint-parser",
    rules: {},
};
