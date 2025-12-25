/**
 * Jest Configuration
 */

module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'services/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true
};
