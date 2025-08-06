import { vitestConfig } from '@aura/vitest-config/node';
import { defineConfig, mergeConfig } from 'vitest/config';

export default defineConfig({ test: { globals: true, disableConsoleIntercept: true } });
