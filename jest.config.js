module.exports = {
  collectCoverageFrom: ['app/**/*.ts', '!app/**/*.e2e.ts', '!app/**/*index.ts'],
  coverageThreshold: { global: { lines: 50 } }
};
