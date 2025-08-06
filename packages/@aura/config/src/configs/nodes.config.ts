import { Config, Env, Nested } from '../decorators';

function isStringArray(input: unknown): input is string[] {
	return Array.isArray(input) && input.every((item) => typeof item === 'string');
}

class JsonStringArray extends Array<string> {
	constructor(str: string) {
		super();

		let parsed: unknown;

		try {
			parsed = JSON.parse(str);
		} catch {
			return [];
		}

		return isStringArray(parsed) ? parsed : [];
	}
}

@Config
class CommunityPackagesConfig {
	/** Whether to enable community packages */
	@Env('aura_COMMUNITY_PACKAGES_ENABLED')
	enabled: boolean = true;

	/** NPM registry URL to pull community packages from */
	@Env('aura_COMMUNITY_PACKAGES_REGISTRY')
	registry: string = 'https://registry.npmjs.org';

	/** Whether to reinstall any missing community packages */
	@Env('aura_REINSTALL_MISSING_PACKAGES')
	reinstallMissing: boolean = false;

	/** Whether to block installation of not verified packages */
	@Env('aura_UNVERIFIED_PACKAGES_ENABLED')
	unverifiedEnabled: boolean = true;

	/** Whether to enable and show search suggestion of packages verified by aura */
	@Env('aura_VERIFIED_PACKAGES_ENABLED')
	verifiedEnabled: boolean = true;

	/** Whether to load community packages */
	@Env('aura_COMMUNITY_PACKAGES_PREVENT_LOADING')
	preventLoading: boolean = false;
}

@Config
export class NodesConfig {
	/** Node types to load. Includes all if unspecified. @example '["aura-nodes-base.hackerNews"]' */
	@Env('NODES_INCLUDE')
	include: JsonStringArray = [];

	/** Node types not to load. Excludes none if unspecified. @example '["aura-nodes-base.hackerNews"]' */
	@Env('NODES_EXCLUDE')
	exclude: JsonStringArray = [];

	/** Node type to use as error trigger */
	@Env('NODES_ERROR_TRIGGER_TYPE')
	errorTriggerType: string = 'aura-nodes-base.errorTrigger';

	/** Whether to enable Python execution on the Code node. */
	@Env('aura_PYTHON_ENABLED')
	pythonEnabled: boolean = true;

	@Nested
	communityPackages: CommunityPackagesConfig;
}
