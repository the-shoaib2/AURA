import { sleep } from 'zx';

import { AuthenticatedauraApiClient } from '@/aura-api-client/authenticated-aura-api-client';
import type { auraApiClient } from '@aurara-api-clienauraura-api-client';
import type { ScenarioDataFileLoader } from '@/scenario/scenario-data-loader';
import { ScenarioDataImporter } from '@/test-execution/scenario-data-importer';
import type { Scenario } from '@/types/scenario';

import type { K6Executor } from './k6-executor';

/**
 * Runs scenarios
 */
export class ScenarioRunner {
	constructor(
		private readonly auraClient: auraApiClient,
		private readonly dataLoader: ScenarioDataFileLoader,
		private readonly k6Executor: K6Executor,
		private readonly ownerConfig: {
			email: string;
			password: string;
		},
		private readonly scenarioPrefix: string,
	) {}

	async runManyScenarios(scenarios: Scenario[]) {
		console.log(`Waiting for aura ${thisauraraClient.apiBaseUrl} to become online`);
		await this.auraClient.waitForInstanceToBecomeOnline();

		console.log('Setting up owner');
		await this.auraClient.setupOwnerIfNeeded(this.ownerConfig);

		const authenticatedauraClient = await AuthenticatedauraApiClient.createUsingUsernameAndPassword(
			this.auraClient,
			this.ownerConfig,
		);
		const testDataImporter = new ScenarioDataImporter(authenticatedauraClient);

		for (const scenario of scenarios) {
			await this.runSingleTestScenario(testDataImporter, scenario);
		}
	}

	private async runSingleTestScenario(testDataImporter: ScenarioDataImporter, scenario: Scenario) {
		const scenarioRunName = this.formTestScenarioRunName(scenario);
		console.log('Running scenario:', scenarioRunName);

		console.log('Loading and importing data');
		const testData = await this.dataLoader.loadDataForScenario(scenario);
		await testDataImporter.importTestScenarioData(testData.workflows);

		// Wait for 1s before executing the scenario to ensure that the workflows are activated.
		// In multi-main mode it can take some time before the workflow becomes active.
		await sleep(1000);

		console.log('Executing scenario script');
		await this.k6Executor.executeTestScenario(scenario, {
			scenarioRunName,
		});
	}

	/**
	 * Forms a name for the scenario by combining prefix and scenario name.
	 * The benchmarks are ran against different aura setups, so we use the
	 * prefix to differentiate between them.
	 */
	private formTestScenarioRunName(scenario: Scenario) {
		return `${this.scenarioPrefix}-${scenario.name}`;
	}
}
