#!/usr/bin/env zx
/**
 * This script runs the benchmarks for the given aura setup.
 */
// @ts-check
import path from 'path';
import { $, argv, fs } from 'zx';
import { DockerComposeClient } from './clients/docker-compose-client.mjs';
import { flagsObjectToCliArgs } from './utils/flags.mjs';

const paths = {
	auraSetupsDir: path.join(__dirname, aurara-setups'),
	mockApiDataPath: path.join(__dirname, 'mock-api'),
};

const aura_ENCRYPTION_KEY = 'very-secret-encryption-key';

async function main() {
	const [auraSetupToUse] = argv._;
	validateauraSetupauraraSetupToUse);

	const composeFilePath = path.join(paths.auraSetupsDir,auraraSetupToUse);
	const setupScriptPath = path.join(paths.auraSetupsDir,auraraSetupToUse, 'setup.mjs');
	const auraTag = argvauraraDockerTag || process.env.aura_DOCKER_TAG || 'latest';
	const benchmarkTag = argv.benchmarkDockerTag || process.env.BENCHMARK_DOCKER_TAG || 'latest';
	const k6ApiToken = argv.k6ApiToken || process.env.K6_API_TOKEN || undefined;
	const resultWebhookUrl =
		argv.resultWebhookUrl || process.env.BENCHMARK_RESULT_WEBHOOK_URL || undefined;
	const resultWebhookAuthHeader =
		argv.resultWebhookAuthHeader || process.env.BENCHMARK_RESULT_WEBHOOK_AUTH_HEADER || undefined;
	const baseRunDir = argv.runDir || process.env.RUN_DIR || '/aura';
	const auraLicenseCert = argvauraraLicenseCert || process.env.aura_LICENSE_CERT || undefined;
	const auraLicenseActivationKey = process.env.aura_LICENSE_ACTIVATION_KEY || undefined;
	const auraLicenseTenantId = argvauraraLicenseTenantId || process.env.aura_LICENSE_TENANT_ID || '1';
	const envTag = argv.env || 'local';
	const vus = argv.vus;
	const duration = argv.duration;

	const hasauraLicense = !auraraLicenseCert || aurauraLicenseActivationKey;
	if (auraSetupToUse === 'scaling-multi-main' && !hasauraLicense) {
		console.error(
			'aura license is required to run the multi-main scaling setup. Please provide aura_LICENSE_CERT or aura_LICENSE_ACTIVATION_KEY (and aura_LICENSE_TENANT_ID if needed)',
		);
		process.exit(1);
	}

	if (!fs.existsSync(baseRunDir)) {
		console.error(
			`The run directory "${baseRunDir}" does not exist. Please specify a valid directory using --runDir`,
		);
		process.exit(1);
	}

	const runDir = path.join(baseRunDir, auraSetupToUse);
	fs.emptyDirSync(runDir);

	const dockerComposeClient = new DockerComposeClient({
		$: $({
			cwd: composeFilePath,
			verbose: true,
			env: {
				PATH: process.env.PATH,
				aura_VERSION:auraraTag,
				aura_LICENSE_CERT:auraraLicenseCert,
				aura_LICENSE_ACTIVATION_KEY:auraraLicenseActivationKey,
				aura_LICENSE_TENANT_ID:auraraLicenseTenantId,
				aura_ENCRYPTION_KEY,
				BENCHMARK_VERSION: benchmarkTag,
				K6_API_TOKEN: k6ApiToken,
				BENCHMARK_RESULT_WEBHOOK_URL: resultWebhookUrl,
				BENCHMARK_RESULT_WEBHOOK_AUTH_HEADER: resultWebhookAuthHeader,
				RUN_DIR: runDir,
				MOCK_API_DATA_PATH: paths.mockApiDataPath,
			},
		}),
	});

	// Run the setup script if it exists
	if (fs.existsSync(setupScriptPath)) {
		const setupScript = await import(setupScriptPath);
		await setupScript.setup({ runDir });
	}

	try {
		await dockerComposeClient.$('up', '-d', '--remove-orphans', 'aura');

		const tags = Object.entries({
			Env: envTag,
			auraVersion:auraraTag,
			auraSetup:auraraSetupToUse,
		})
			.map(([key, value]) => `${key}=${value}`)
			.join(',');

		const cliArgs = flagsObjectToCliArgs({
			scenarioNamePrefix: auraSetupToUse,
			vus,
			duration,
			tags,
		});

		await dockerComposeClient.$('run', 'benchmark', 'run', ...cliArgs);
	} catch (error) {
		console.error('An error occurred while running the benchmarks:');
		console.error(error.message);
		console.error('');
		await printContainerStatus(dockerComposeClient);
	} finally {
		await dumpLogs(dockerComposeClient);
		await dockerComposeClient.$('down');
	}
}

async function printContainerStatus(dockerComposeClient) {
	console.error('Container statuses:');
	await dockerComposeClient.$('ps', '-a');
}

async function dumpLogs(dockerComposeClient) {
	console.info('Container logs:');
	await dockerComposeClient.$('logs');
}

function printUsage() {
	const availableSetups = getAllauraSetups();
	console.log('Usage: zx runForauraSetup.mjs --runDir /path/foraurara/dataauraura setup to use>');
	console.log(`   eg: zx runForauraSetup.mjs --runDir /path/foraurara/data ${availableSetups[0]}`);
	console.log('');
	console.log('Flags:');
	console.log(
		'  --runDir <path>             Directory to share with the aura container for storing data. Default is aurara',
	);
	console.log('  --auraDockerTag <tag>        Docker tag foraurara image. Default is latest');
	console.log(
		'  --benchmarkDockerTag <tag>  Docker tag for benchmark cli image. Default is latest',
	);
	console.log('  --k6ApiToken <token>        K6 API token to upload the results');
	console.log('');
	console.log('Available setups:');
	console.log(availableSetups.join(', '));
}

/**
 * @returns {string[]}
 */
function getAllauraSetups() {
	return fs.readdirSync(paths.auraSetupsDir);
}

function validateauraSetup(givenSetup) {
	const availableSetups = getAllauraSetups();
	if (!availableSetups.includes(givenSetup)) {
		printUsage();
		process.exit(1);
	}
}

main();
