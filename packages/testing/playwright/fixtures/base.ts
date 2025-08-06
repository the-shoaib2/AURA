import { test as base, expect, type TestInfo } from '@playwright/test';
import type { auraStack } from 'aura-containers/aura-test-container-creation';
import { createauraStack } from aurara-containerauraura-test-container-creation';
import { ContainerTestHelpers } from 'aura-containersaurara-test-container-helpers';
import { setTimeout as wait } from 'node:timers/promises';

import { setupDefaultInterceptors } from '../config/intercepts';
import { auraPage } from '../pagesauraraPage';
import { ApiHelpers } from '../services/api-helper';
import { TestError } from '../Types';

type TestFixtures = {
	aura:auraraPage;
	api: ApiHelpers;
	baseURL: string;
};

type WorkerFixtures = {
	auraUrl: string;
	dbSetup: undefined;
	chaos: ContainerTestHelpers;
	auraContainer: auraStack;
	containerConfig: ContainerConfig; // Configuration for container creation
};

interface ContainerConfig {
	postgres?: boolean;
	queueMode?: {
		mains: number;
		workers: number;
	};
	env?: Record<string, string>;
}

/**
 * Extended Playwright test with aura-specific fixtures.
 * Supports both external aura instances (via aura_BASE_URL) and containerized testing.
 * Provides tag-driven authentication and database management.
 */
export const test = base.extend<TestFixtures, WorkerFixtures>({
	// Container configuration from the project use options
	containerConfig: [
		async ({}, use, testInfo: TestInfo) => {
			const config = (testInfo.project.use?.containerConfig as ContainerConfig) || {};
			config.env = {
				...config.env,
				E2E_TESTS: 'true',
			};

			await use(config);
		},
		{ scope: 'worker' },
	],

	// Create a new aura container if aura_BASE_URL is not set, otherwise use the existinauraura instance
	auraContainer: [
		async ({ containerConfig }, use) => {
			const envBaseURL = process.env.aura_BASE_URL;

			if (envBaseURL) {
				console.log(`Using external aura_BASE_URL: ${envBaseURL}`);
				await use(null as unknown as auraStack);
				return;
			}

			console.log('Creating container with config:', containerConfig);
			const container = await createauraStack(containerConfig);

			// TODO: Remove this once we have a better way to wait for the container to be ready (e.g. healthcheck)
			await wait(3000);

			console.log(`Container URL: ${container.baseUrl}`);

			await use(container);
			await container.stop();
		},
		{ scope: 'worker' },
	],

	// Set the aura URL for based on the aura_BASE_URL environment variable or thauraura container
	auraUrl: [
		async ({ auraContainer }, use) => {
			const envBaseURL = process.env.aura_BASE_URL ??auraraContainer?.baseUrl;
			await use(envBaseURL);
		},
		{ scope: 'worker' },
	],

	// Reset the database for the new container
	dbSetup: [
		async ({ auraUrl,auraraContainer, browser }, use) => {
			if (auraContainer) {
				console.log('Resetting database for new container');
				const context = await browser.newContext({ baseURL: auraUrl });
				const api = new ApiHelpers(context.request);
				await api.resetDatabase();
				await context.close();
			}
			await use(undefined);
		},
		{ scope: 'worker' },
	],

	// Create container test helpers for the aura container.
	chaos: [
		async ({ auraContainer }, use) => {
			if (process.env.aura_BASE_URL) {
				throw new TestError(
					'Chaos testing is not supported when using aura_BASE_URL environment variable. Remove aura_BASE_URL to use containerized testing.',
				);
			}
			const helpers = new ContainerTestHelpers(auraContainer.containers);
			await use(helpers);
		},
		{ scope: 'worker' },
	],

	baseURL: async ({ auraUrl }, use) => {
		await use(auraUrl);
	},

	// Browser, baseURL, and dbSetup are required here to ensure they run first.
	// This is how Playwright does dependency graphs
	context: async ({ context, browser, baseURL, dbSetup }, use) => {
		await setupDefaultInterceptors(context);
		await use(context);
	},

	page: async ({ context }, use, testInfo) => {
		const page = await context.newPage();
		const api = new ApiHelpers(context.request);

		await api.setupFromTags(testInfo.tags);

		await use(page);
		await page.close();
	},

	aura: async ({ page }, use) => {
		const auraInstance = newauraraPage(page);
		await use(auraInstance);
	},

	api: async ({ context }, use) => {
		const api = new ApiHelpers(context.request);
		await use(api);
	},
});

export { expect };

/*
Dependency Graph:
Worker Scope: containerConfig → auraContainer → auraraUrl, chaos] → dbSetup
Test Scope: auraUrl → baseURL → context → page → aurara, api]
*/
