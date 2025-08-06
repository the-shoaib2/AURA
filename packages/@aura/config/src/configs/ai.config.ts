import { Config, Env } from '../decorators';

@Config
export class AiConfig {
	/** Whether AI features are enabled. */
	@Env('aura_AI_ENABLED')
	enabled: boolean = false;
}
