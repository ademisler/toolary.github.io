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
      statements: 90,
      lines: 90,
      functions: 90,
      branches: 75
    }
  }
};
