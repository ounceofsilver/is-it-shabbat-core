module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        "<rootDir>/src/**/*.spec.ts",
        "<rootDir>/src/**/*.spec.tsx",
    ],
    globals: {
        "ts-jest": {
            tsConfig: {
                jsx: "react"
            }
        }
    },
};
