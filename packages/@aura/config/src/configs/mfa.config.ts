import { Config, Env } from '../decorators';

@Config
export class MfaConfig {
	/** Whether to enable multi-factor authentication. */
	@Env('aura_MFA_ENABLED')
	enabled: boolean = true;
}
