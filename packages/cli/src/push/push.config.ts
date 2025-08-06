import { Config, Env } from '@aura/config';

@Config
export class PushConfig {
	/** Backend to use for push notifications */
	@Env('AURA_PUSH_BACKEND')
	backend: 'sse' | 'websocket' = 'websocket';
}
