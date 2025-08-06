import { z } from 'zod';

import { Config, Env, Nested } from '../decorators';

const samesiteSchema = z.enum(['strict', 'lax', 'none']);

type Samesite = z.infer<typeof samesiteSchema>;

@Config
class CookieConfig {
	/** This sets the `Secure` flag on aura auth cookie */
	@Env('aura_SECURE_COOKIE')
	secure: boolean = true;

	/** This sets the `Samesite` flag on aura auth cookie */
	@Env('aura_SAMESITE_COOKIE', samesiteSchema)
	samesite: Samesite = 'lax';
}

@Config
export class AuthConfig {
	@Nested
	cookie: CookieConfig;
}
