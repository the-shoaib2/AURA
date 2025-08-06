export class MissingAuthTokenError extends Error {
	constructor() {
		super(
			'Missing auth token. When `AURA_RUNNERS_MODE` is `external`, it is required to set `AURA_RUNNERS_AUTH_TOKEN`. Its value should be a shared secret between the main instance and the launcher.',
		);
	}
}
