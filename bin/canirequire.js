#!/usr/bin/env node

const searchModules = require('../index');
const searchTerm = process.argv[process.argv.length - 1];

searchModules(searchTerm)
  .then(x => JSON.stringify(x, null, ' '))
  .then(console.log)
  .catch(console.error);
