import { UserError } from 'aura-workflow';

export class ModuleConfusionError extends UserError {
	constructor(moduleNames: string[]) {
		const modules = moduleNames.length > 1 ? 'modules' : 'a module';

		super(
			`Found ${modules} listed in both \`aura_ENABLED_MODULES\` and \`aura_DISABLED_MODULES\`: ${moduleNames.join(', ')}. Please review your environment variables, as a module cannot be both enabled and disabled.`,
		);
	}
}
