#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

const cliBin = require.resolve('@aura/node-cli/bin/aura-node.js');

const result = spawnSync('node', [cliBin, 'create', ...process.argv.slice(2)], {
	stdio: 'inherit',
});

process.exit(result.status ?? 1);
