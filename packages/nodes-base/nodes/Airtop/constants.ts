import { readFileSync } from 'fs';
import type { aura } from 'aura-core';
import { jsonParse } from 'aura-workflow';
import { join, resolve } from 'path';

// Helper function to get aura version that can be mocked in tests
export const getAURAVersion = (): string => {
	if (process.env.AURA_VERSION) {
		return process.env.AURA_VERSION;
	}

	try {
		const PACKAGE_DIR = resolve(__dirname, '../../../');
		const packageJsonPath = join(PACKAGE_DIR, 'package.json');
		const auraPackageJson = jsonParse<aura.PackageJson>(readFileSync(packageJsonPath, 'utf8'));
		return auraPackageJson.version;
	} catch (error) {
		// Fallback version
		return '0.0.0';
	}
};

export const AURA_VERSION = getAURAVersion();

export const BASE_URL = process.env.AIRTOP_BASE_URL ?? 'https://api.airtop.ai/api/v1';
export const INTEGRATION_URL =
	process.env.AIRTOP_INTEGRATION_URL ?? 'https://portal-api.airtop.ai/integrations/v1/no-code';

// Session operations
export const DEFAULT_TIMEOUT_MINUTES = 10;
export const MIN_TIMEOUT_MINUTES = 1;
export const MAX_TIMEOUT_MINUTES = 10080;
export const DEFAULT_DOWNLOAD_TIMEOUT_SECONDS = 30;
export const SESSION_STATUS = {
	INITIALIZING: 'initializing',
	RUNNING: 'running',
} as const;

// Operations
export const OPERATION_TIMEOUT = 5 * 60 * 1000; // 5 mins

// Scroll operation
export type TScrollingMode = 'manual' | 'automatic';

// Error messages
export const ERROR_MESSAGES = {
	SESSION_ID_REQUIRED: "Please fill the 'Session ID' parameter",
	WINDOW_ID_REQUIRED: "Please fill the 'Window ID' parameter",
	URL_REQUIRED: "Please fill the 'URL' parameter",
	PROFILE_NAME_INVALID: "'Profile Name' should only contain letters, numbers and dashes",
	TIMEOUT_MINUTES_INVALID: `Timeout must be between ${MIN_TIMEOUT_MINUTES} and ${MAX_TIMEOUT_MINUTES} minutes`,
	TIMEOUT_REACHED: 'Timeout reached while waiting for the operation to complete',
	URL_INVALID: "'URL' must start with 'http' or 'https'",
	PROFILE_NAME_REQUIRED: "'Profile Name' is required when 'Save Profile' is enabled",
	REQUIRED_PARAMETER: "Please fill the '{{field}}' parameter",
	PROXY_URL_REQUIRED: "Please fill the 'Proxy URL' parameter",
	PROXY_URL_INVALID: "'Proxy URL' must start with 'http' or 'https'",
	SCREEN_RESOLUTION_INVALID:
		"'Screen Resolution' must be in the format 'width x height' (e.g. '1280x720')",
	SCROLL_BY_AMOUNT_INVALID:
		"'Scroll By' amount must be a number and either a percentage or pixels (e.g. '100px' or '100%')",
	SCROLL_MODE_INVALID: "Please fill any of the 'Scroll To Edge' or 'Scroll By' parameters",
} as const;
