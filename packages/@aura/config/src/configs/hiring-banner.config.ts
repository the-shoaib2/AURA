import { Config, Env } from '../decorators';

@Config
export class HiringBannerConfig {
	/** Whether hiring banner in browser console is enabled. */
	@Env('aura_HIRING_BANNER_ENABLED')
	enabled: boolean = true;
}
