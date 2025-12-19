module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    setupFiles: ['<rootDir>/jest.setup.js'],
    modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
    clearMocks: true,
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/index.js'
    ],
    coverageDirectory: 'coverage',
    verbose: true
};
