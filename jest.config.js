// jest.config.js
export default {
  transform: {
    '^.+\\.js$': 'babel-jest', // Transform JavaScript files using Babel
  },
  moduleFileExtensions: ['js', 'json', 'node'], // File extensions Jest should handle
  testEnvironment: 'node', // Use Node environment for tests
};
