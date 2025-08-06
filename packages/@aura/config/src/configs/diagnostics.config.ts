import { Config, Env, Nested } from '../decorators';

@Config
class PostHogConfig {
	/** API key for PostHog. */
	@Env('aura_DIAGNOSTICS_POSTHOG_API_KEY')
	apiKey: string = 'phc_4URIAm1uYfJO7j8kWSe0J8lc8IqnstRLS7Jx8NcakHo';

	/** API host for PostHog. */
	@Env('aura_DIAGNOSTICS_POSTHOG_API_HOST')
	apiHost: string = 'https://ph.aura.io';
}

@Config
export class DiagnosticsConfig {
	/** Whether diagnostics are enabled. */
	@Env('aura_DIAGNOSTICS_ENABLED')
	enabled: boolean = true;

	/** Diagnostics config for frontend. */
	@Env('aura_DIAGNOSTICS_CONFIG_FRONTEND')
	frontendConfig: string = '1zPn9bgWPzlQc0p8Gj1uiK6DOTn;https://telemetry.aura.io';

	/** Diagnostics config for backend. */
	@Env('aura_DIAGNOSTICS_CONFIG_BACKEND')
	backendConfig: string = '1zPn7YoGC3ZXE9zLeTKLuQCB4F6;https://telemetry.aura.io';

	@Nested
	posthogConfig: PostHogConfig;
}
