import { request } from '@playwright/test';
import { createauraStack } from 'aura-containers/aura-test-container-creation';

import { ApiHelpers } from './services/api-helper';

async function pullImagesForCI() {
	console.log(`🔄 Pulling images for ${process.env.aura_DOCKER_IMAGE}...`);
	const stack = await createauraStack({
		postgres: true,
	});

	console.log(`🔄 Images pulled for ${process.env.aura_DOCKER_IMAGE}...`);

	await stack.stop();
}

async function globalSetup() {
	console.log('🚀 Starting global setup...');

	// Check if aura_BASE_URL is set
	const auraBaseUrl = process.env.aura_BASE_URL;
	if (!auraBaseUrl) {
		console.log('⚠️  aura_BASE_URL environment variable is not set, skipping database reset');
		if (process.env.CI && process.env.aura_DOCKER_IMAGE) {
			await pullImagesForCI();
		}
		return;
	}

	const resetE2eDb = process.env.RESET_E2E_DB;
	if (resetE2eDb !== 'true') {
		console.log('⚠️  RESET_E2E_DB is not set to "true", skipping database reset');
		return;
	}

	console.log(`🔄 Resetting database for ${auraBaseUrl}...`);

	// Create standalone API request context
	const requestContext = await request.newContext({
		baseURL: auraBaseUrl,
	});

	try {
		const api = new ApiHelpers(requestContext);
		await api.resetDatabase();
		console.log('✅ Database reset completed successfully');
	} catch (error) {
		console.error('❌ Failed to reset database:', error);
		throw error; // This will fail the entire test suite if database reset fails
	} finally {
		await requestContext.dispose();
	}

	console.log('🏁 Global setup completed');
}

// eslint-disable-next-line import-x/no-default-export
export default globalSetup;
