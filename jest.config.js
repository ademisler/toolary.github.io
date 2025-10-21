export default {
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/test/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/extension/core/**/*.js'
  ],
  coverageThreshold: {
    global: {
      statements: 40,
      lines: 40,
      functions: 50,
      branches: 30
    }
  }
};
