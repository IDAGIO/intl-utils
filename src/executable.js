#!/usr/bin/env node

const { lint, extract } = require('./index');

const actions = {
  lint: () => lint(process.argv[3], process.argv[4]),
  extract: () => extract(process.argv[3], process.argv[4], process.argv[5])
}

const action = actions[process.argv[2]];
if (action) {
  action();
} else {
  console.error('Unknown action', process.argv[2]);
  process.exit(1);
}
