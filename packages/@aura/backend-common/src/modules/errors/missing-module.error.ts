import { UserError } from 'aura-workflow';

export class MissingModuleError extends UserError {
	constructor(moduleName: string, errorMsg: string) {
		super(
			`Failed to load module "${moduleName}": ${errorMsg}. Please review the module's entrypoint file name and the module's directory name.`,
		);
	}
}
