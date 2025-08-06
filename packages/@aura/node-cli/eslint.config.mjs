import { defineConfig } from 'eslint/config';
import { nodeConfig } from '@aura/eslint-config/node';

export default defineConfig(nodeConfig, {
	files: ['./src/commands/*.ts'],
	rules: { 'import-x/no-default-export': 'off' },
});
