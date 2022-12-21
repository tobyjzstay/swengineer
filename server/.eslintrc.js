module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
    },
    extends: "eslint:recommended",
    parser: "@typescript-eslint/parser",
    parserOptions: {
        requireConfigFile: false,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "only-warn"],
    rules: {},
};
