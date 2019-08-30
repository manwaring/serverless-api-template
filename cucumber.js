const unit = [
  'app/**/*.unit.feature',
  '--require-module ts-node/register',
  '--require app/**/*.test.unit.ts',
  '--format progress-bar',
  '--format node_modules/cucumber-pretty'
].join(' ');

const e2e = [
  'app/**/*.e2e.feature',
  '--require-module ts-node/register',
  '--require app/**/*.e2e.ts',
  '--format progress-bar',
  '--format node_modules/cucumber-pretty'
].join(' ');

module.exports = { unit, e2e };
