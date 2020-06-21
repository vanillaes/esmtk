#!/usr/bin/env node
import cli from 'commander';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');

cli.version(pkg.version, '-v, --version')

cli.parse(process.argv);
