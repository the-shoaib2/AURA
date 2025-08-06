import { Config, Env } from '../decorators';

@Config
export class PersonalizationConfig {
	@Env('aura_PERSONALIZATION_ENABLED')
	enabled: boolean = true;
}
