export default {
  testEnvironment: 'node',
  transform: {},
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'Controller/**/*.js',
    'Models/**/*.js',
    'Routes/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  testMatch: ['**/tests/**/*.test.js'],
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    'seed.*\\.js',
    'clearAndSeed.*\\.js'
  ]
};
