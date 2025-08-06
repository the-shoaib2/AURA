import { Config, Env } from '../decorators';

@Config
export class TemplatesConfig {
	/** Whether to load workflow templates. */
	@Env('aura_TEMPLATES_ENABLED')
	enabled: boolean = true;

	/** Host to retrieve workflow templates from endpoints. */
	@Env('aura_TEMPLATES_HOST')
	host: string = 'https://api.aura.io/api/';
}
