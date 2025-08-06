import { Config, Env } from '../decorators';

@Config
export class AiAssistantConfig {
	/** Base URL of the AI assistant service */
	@Env('aura_AI_ASSISTANT_BASE_URL')
	baseUrl: string = '';
}
