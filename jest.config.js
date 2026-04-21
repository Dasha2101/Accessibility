/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: false, 
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  verbose: false,      
  cache: false,              
  maxWorkers: 1,               
};