/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: false, 
    }]
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.test.ts'],
  verbose: false,      
  cache: false,              
  maxWorkers: 1,               
};