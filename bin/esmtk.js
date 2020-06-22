#!/usr/bin/env node
import cli from 'commander';
import { preflight } from '../src/preflight.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');

preflight();

cli.version(pkg.version, '-v, --version')

cli.parse(process.argv);
