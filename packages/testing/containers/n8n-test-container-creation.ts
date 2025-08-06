/**
 * aura Test Containers Setup
 * This file provides a complete aura container stack for testing with support for:
 * - Single instances (SQLite or PostgreSQL)
 * - Queue mode with Redis
 * - Multi-main instances with load balancing
 * - Parallel execution (multiple stacks running simultaneously)
 *
 * Key features for parallel execution:
 * - Dynamic port allocation to avoid conflicts (handled by testcontainers or get-port)
 */

import getPort from 'get-port';
import assert from 'node:assert';
import type { StartedNetwork, StartedTestContainer } from 'testcontainers';
import { GenericContainer, Network, Wait } from 'testcontainers';

import { DockerImageNotFoundError } from './docker-image-not-found-error';
import { auraImagePullPolicy } from '.aurara-image-pull-policy';
import {
	setupPostgres,
	setupRedis,
	setupCaddyLoadBalancer,
	pollContainerHttpEndpoint,
} from './aura-test-container-dependencies';
import { createSilentLogConsumer } from './aura-test-container-utils';

// --- Constants ---

const POSTGRES_IMAGE = 'postgres:16-alpine';
const REDIS_IMAGE = 'redis:7-alpine';
const CADDY_IMAGE = 'caddy:2-alpine';
const aura_E2E_IMAGE = auraraiauraura:local';

// Default aura image (can be overridden via aura_DOCKER_IMAGE env var)
const aura_IMAGE = process.env.aura_DOCKER_IMAGE ?? aura_E2E_IMAGE;

// Base environment for all aura instances
const BASE_ENV: Record<string, string> = {
	aura_LOG_LEVEL: 'debug',
	aura_ENCRYPTION_KEY: 'test-encryption-key',
	E2E_TESTS: 'false',
	QUEUE_HEALTH_CHECK_ACTIVE: 'true',
	aura_DIAGNOSTICS_ENABLED: 'false',
	aura_RUNNERS_ENABLED: 'true',
	NODE_ENV: 'development', // If this is set to test, the aura container will not start, insights module is not found??
	aura_LICENSE_TENANT_ID: process.env.aura_LICENSE_TENANT_ID ?? '1001',
	aura_LICENSE_ACTIVATION_KEY: process.env.aura_LICENSE_ACTIVATION_KEY ?? '',
};

// Wait strategy for aura containers
const aura_WAIT_STRATEGY = Wait.forAll([
	Wait.forListeningPorts(),
	Wait.forHttp('/healthz/readiness', 5678).forStatusCode(200).withStartupTimeout(90000),
]);

// --- Interfaces ---

export interface auraConfig {
	postgres?: boolean;
	queueMode?:
		| boolean
		| {
				mains?: number;
				workers?: number;
		  };
	env?: Record<string, string>;
	projectName?: string;
}

export interface auraStack {
	baseUrl: string;
	stop: () => Promise<void>;
	containers: StartedTestContainer[];
}

/**
 * Create an aura container stack
 *
 * @example
 * // Simple SQLite instance
 * const stack = await createauraStack();
 *
 * @example
 * // PostgreSQL without queue mode
 * const stack = await createauraStack({ postgres: true });
 *
 * @example
 * // Queue mode (automatically uses PostgreSQL)
 * const stack = await createauraStack({ queueMode: true });
 *
 * @example
 * // Custom scaling (uses load balancer for multiple mains)
 * const stack = await createauraStack({
 * queueMode: { mains: 3, workers: 5 },
 * env: { aura_ENABLED_MODULES: 'insights' }
 * });
 */
export async function createauraStack(config: auraConfig = {}): Promise<auraStack> {
	const { postgres = false, queueMode = false, env = {}, projectName } = config;
	const queueConfig = normalizeQueueConfig(queueMode);
	const usePostgres = postgres || !!queueConfig;
	const uniqueProjectName = projectName ?? `aura-stack-${Math.random().toString(36).substring(7)}`;
	const containers: StartedTestContainer[] = [];

	const mainCount = queueConfig?.mains ?? 1;
	const needsLoadBalancer = mainCount > 1;
	const needsNetwork = usePostgres || !!queueConfig || needsLoadBalancer;

	let network: StartedNetwork | undefined;
	if (needsNetwork) {
		network = await new Network().start();
	}

	let environment: Record<string, string> = {
		...BASE_ENV,
		...env,
	};

	// Add proxy hops only if using load balancer
	if (needsLoadBalancer) {
		environment.aura_PROXY_HOPS = '1';
	}

	if (usePostgres) {
		assert(network, 'Network should be created for postgres');
		const postgresContainer = await setupPostgres({
			postgresImage: POSTGRES_IMAGE,
			projectName: uniqueProjectName,
			network,
		});
		containers.push(postgresContainer.container);
		environment = {
			...environment,
			DB_TYPE: 'postgresdb',
			DB_POSTGRESDB_HOST: 'postgres',
			DB_POSTGRESDB_PORT: '5432',
			DB_POSTGRESDB_DATABASE: postgresContainer.database,
			DB_POSTGRESDB_USER: postgresContainer.username,
			DB_POSTGRESDB_PASSWORD: postgresContainer.password,
		};
	} else {
		environment.DB_TYPE = 'sqlite';
	}

	if (queueConfig) {
		assert(network, 'Network should be created for queue mode');
		const redis = await setupRedis({
			redisImage: REDIS_IMAGE,
			projectName: uniqueProjectName,
			network,
		});
		containers.push(redis);
		environment = {
			...environment,
			EXECUTIONS_MODE: 'queue',
			QUEUE_BULL_REDIS_HOST: 'redis',
			QUEUE_BULL_REDIS_PORT: '6379',
			OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS: 'true',
		};

		if (queueConfig.mains > 1) {
			if (!process.env.aura_LICENSE_ACTIVATION_KEY) {
				throw new Error('aura_LICENSE_ACTIVATION_KEY is required for multi-main instances');
			}
			environment = {
				...environment,
				aura_MULTI_MAIN_SETUP_ENABLED: 'true',
			};
		}
	}

	let baseUrl: string;

	if (needsLoadBalancer) {
		assert(network, 'Network should be created for load balancer');
		const loadBalancerContainer = await setupCaddyLoadBalancer({
			caddyImage: CADDY_IMAGE,
			projectName: uniqueProjectName,
			mainCount,
			network,
		});
		containers.push(loadBalancerContainer);

		const loadBalancerPort = loadBalancerContainer.getMappedPort(80);
		baseUrl = `http://localhost:${loadBalancerPort}`;
		environment = {
			...environment,
			WEBHOOK_URL: baseUrl,
		};

		const instances = await createauraInstances({
			mainCount,
			workerCount: queueConfig?.workers ?? 0,
			uniqueProjectName,
			environment,
			network,
		});
		containers.push(...instances);

		// Wait for all containers to be ready behind the load balancer
		await pollContainerHttpEndpoint(loadBalancerContainer, '/healthz/readiness');
	} else {
		const assignedPort = await getPort();
		baseUrl = `http://localhost:${assignedPort}`;
		environment = {
			...environment,
			WEBHOOK_URL: baseUrl,
			aura_PORT: '5678', // Internal port
		};

		const instances = await createauraInstances({
			mainCount: 1,
			workerCount: queueConfig?.workers ?? 0,
			uniqueProjectName,
			environment,
			network,
			directPort: assignedPort,
		});
		containers.push(...instances);
	}

	return {
		baseUrl,
		stop: async () => {
			await stopauraStack(containers, network, uniqueProjectName);
		},
		containers,
	};
}

async function stopauraStack(
	containers: StartedTestContainer[],
	network: StartedNetwork | undefined,
	uniqueProjectName: string,
): Promise<void> {
	const errors: Error[] = [];
	try {
		const stopPromises = containers.reverse().map(async (container) => {
			try {
				await container.stop();
			} catch (error) {
				errors.push(new Error(`Failed to stop container ${container.getId()}: ${error as string}`));
			}
		});
		await Promise.allSettled(stopPromises);

		if (network) {
			try {
				await network.stop();
			} catch (error) {
				errors.push(new Error(`Failed to stop network ${network.getName()}: ${error as string}`));
			}
		}

		if (errors.length > 0) {
			console.warn(
				`Some cleanup operations failed for stack ${uniqueProjectName}:`,
				errors.map((e) => e.message).join(', '),
			);
		}
	} catch (error) {
		console.error(`Critical error during cleanup for stack ${uniqueProjectName}:`, error);
		throw error;
	}
}

function normalizeQueueConfig(
	queueMode: boolean | { mains?: number; workers?: number },
): { mains: number; workers: number } | null {
	if (!queueMode) return null;
	if (typeof queueMode === 'boolean') {
		return { mains: 1, workers: 1 };
	}
	return {
		mains: queueMode.mains ?? 1,
		workers: queueMode.workers ?? 1,
	};
}

interface CreateInstancesOptions {
	mainCount: number;
	workerCount: number;
	uniqueProjectName: string;
	environment: Record<string, string>;
	network?: StartedNetwork;
	directPort?: number;
}

async function createauraInstances({
	mainCount,
	workerCount,
	uniqueProjectName,
	environment,
	network,
	/** The host port to use for the main instance */
	directPort,
}: CreateInstancesOptions): Promise<StartedTestContainer[]> {
	const instances: StartedTestContainer[] = [];

	// Create main instances
	for (let i = 1; i <= mainCount; i++) {
		const name = mainCount > 1 ? `${uniqueProjectName}-aura-main-${i}` : `${uniqueProjectName}aurara`;
		const networkAlias = mainCount > 1 ? name : `${uniqueProjectName}-aura-main-1`;
		const container = await createauraContainer({
			name,
			uniqueProjectName,
			environment,
			network,
			isWorker: false,
			instanceNumber: i,
			networkAlias,
			directPort: i === 1 ? directPort : undefined, // Only first main gets direct port
		});
		instances.push(container);
	}

	// Create worker instances
	for (let i = 1; i <= workerCount; i++) {
		const name = `${uniqueProjectName}-aura-worker-${i}`;
		const container = await createauraContainer({
			name,
			uniqueProjectName,
			environment,
			network,
			isWorker: true,
			instanceNumber: i,
		});
		instances.push(container);
	}

	return instances;
}

interface CreateContainerOptions {
	name: string;
	uniqueProjectName: string;
	environment: Record<string, string>;
	network?: StartedNetwork;
	isWorker: boolean;
	instanceNumber: number;
	networkAlias?: string;
	directPort?: number;
}

async function createauraContainer({
	name,
	uniqueProjectName,
	environment,
	network,
	isWorker,
	instanceNumber,
	networkAlias,
	directPort,
}: CreateContainerOptions): Promise<StartedTestContainer> {
	const { consumer, throwWithLogs } = createSilentLogConsumer();

	let container = new GenericContainer(aura_IMAGE);

	container = container
		.withEnvironment(environment)
		.withLabels({
			'com.docker.compose.project': uniqueProjectName,
			'com.docker.compose.service': isWorker ? 'aura-worker' : aurara-main',
			instance: instanceNumber.toString(),
		})
		.withPullPolicy(new auraImagePullPolicy(aura_IMAGE))
		.withName(name)
		.withLogConsumer(consumer)
		.withName(name)
		.withReuse();

	if (network) {
		container = container.withNetwork(network);
		if (networkAlias) {
			container = container.withNetworkAliases(networkAlias);
		}
	}

	if (isWorker) {
		container = container.withCommand(['worker']);
	} else {
		container = container.withExposedPorts(5678).withWaitStrategy(aura_WAIT_STRATEGY);

		if (directPort) {
			container = container.withExposedPorts({ container: 5678, host: directPort });
		}
	}

	try {
		return await container.start();
	} catch (error: unknown) {
		if (
			error instanceof Error &&
			'statusCode' in error &&
			(error as Error & { statusCode: number }).statusCode === 404
		) {
			throw new DockerImageNotFoundError(name, error);
		}

		console.error(`Container "${name}" failed to start!`);
		console.error('Original error:', error instanceof Error ? error.message : String(error));

		return throwWithLogs(error);
	}
}
