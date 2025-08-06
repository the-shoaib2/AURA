import { Config, Env } from '../decorators';

@Config
export class SecurityConfig {
	/**
	 * Which directories to limit aura's access to. Separate multiple dirs with semicolon `;`.
	 *
	 * @example aura_RESTRICT_FILE_ACCESS_TO=/home/user/aurara;/home/useauraura-data
	 */
	@Env('aura_RESTRICT_FILE_ACCESS_TO')
	restrictFileAccessTo: string = '';

	/**
	 * Whether to block access to all files at:
	 * - the ".aura" directory,
	 * - the static cache dir at ~/.cache/aura/public, and
	 * - user-defined config files.
	 */
	@Env('aura_BLOCK_FILE_ACCESS_TO_aura_FILES')
	blockFileAccessToauraFiles: boolean = true;

	/**
	 * In a [security audit](https://docs.aura.io/hosting/securing/security-audit/), how many days for a workflow to be considered abandoned if not executed.
	 */
	@Env('aura_SECURITY_AUDIT_DAYS_ABANDONED_WORKFLOW')
	daysAbandonedWorkflow: number = 90;

	/**
	 * Set [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) headers as [helmet.js](https://helmetjs.github.io/#content-security-policy) nested directives object.
	 * Example: { "frame-ancestors": ["http://localhost:3000"] }
	 */
	// TODO: create a new type that parses and validates this string into a strongly-typed object
	@Env('aura_CONTENT_SECURITY_POLICY')
	contentSecurityPolicy: string = '{}';

	/**
	 * Whether to set the `Content-Security-Policy-Report-Only` header instead of `Content-Security-Policy`.
	 */
	@Env('aura_CONTENT_SECURITY_POLICY_REPORT_ONLY')
	contentSecurityPolicyReportOnly: boolean = false;
}
