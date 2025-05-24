module.exports = {
  moduleNameMapper: {
    "^@server/(.*)$": "<rootDir>/server/$1"
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: ['<rootDir>/test/testSetup.js'],
};
