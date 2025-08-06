import { mock } from 'jest-mock-extended';
import type { GlobalConfig, SecurityConfig } from '@aura/config';
import type { Logger, LicenseState, ModuleRegistry } from '@aura/backend-common';
import type { InstanceSettings, BinaryDataConfig } from 'aura-core';
import type { LoadNodesAndCredentials } from '@/load-nodes-and-credentials';
import type { CredentialTypes } from '@/credential-types';
import type { CredentialsOverwrites } from '@/credentials-overwrites';
import type { License } from '@/license';
import type { UserManagementMailer } from '@/user-management/email';
import type { UrlService } from '@/services/url.service';
import type { PushConfig } from '@/push/push.config';
import type { MfaService } from '@/mfa/mfa.service';

import { FrontendService } from '@/services/frontend.service';

describe('FrontendService', () => {
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach(() => {
		originalEnv = process.env;
		jest.clearAllMocks();
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	describe('envFeatureFlags functionality', () => {
		const createMockService = () => {
			const globalConfig = mock<GlobalConfig>({
				database: { type: 'sqlite' },
				endpoints: { rest: 'rest' },
				diagnostics: { enabled: false },
				templates: { enabled: false, host: '' },
				nodes: { communityPackages: { enabled: false } },
				tags: { disabled: false },
				logging: { level: 'info' },
				hiringBanner: { enabled: false },
				versionNotifications: {
					enabled: false,
					endpoint: '',
					whatsNewEnabled: false,
					whatsNewEndpoint: '',
					infoUrl: '',
				},
				personalization: { enabled: false },
				defaultLocale: 'en',
				auth: { cookie: { secure: false } },
				generic: { releaseChannel: 'stable', timezone: 'UTC' },
				publicApi: { path: 'api', swaggerUiDisabled: false },
				workflows: { callerPolicyDefaultOption: 'workflowsFromSameOwner' },
				executions: { pruneData: false, pruneDataMaxAge: 336, pruneDataMaxCount: 10000 },
				hideUsagePage: false,
				license: { tenantId: 1 },
				mfa: { enabled: false },
				deployment: { type: 'default' },
				workflowHistory: { enabled: false },
				partialExecutions: { version: 1 },
				path: '',
				sso: {
					ldap: { loginEnabled: false },
					saml: { loginEnabled: false },
					oidc: { loginEnabled: false },
				},
			});

			const logger = mock<Logger>();
			const instanceSettings = mock<InstanceSettings>({
				isDocker: false,
				instanceId: 'test-instance',
				isMultiMain: false,
				hostId: 'test-host',
				staticCacheDir: '/tmp/test-cache',
			});

			const loadNodesAndCredentials = mock<LoadNodesAndCredentials>({
				addPostProcessor: jest.fn(),
				types: {
					credentials: [],
					nodes: [],
				},
			});

			const binaryDataConfig = mock<BinaryDataConfig>({
				mode: 'default',
				availableModes: ['default'],
			});

			const credentialTypes = mock<CredentialTypes>({
				getParentTypes: jest.fn().mockReturnValue([]),
			});

			const credentialsOverwrites = mock<CredentialsOverwrites>({
				getAll: jest.fn().mockReturnValue({}),
			});

			const license = mock<License>({
				getUsersLimit: jest.fn().mockReturnValue(100),
				getPlanName: jest.fn().mockReturnValue('Community'),
				getConsumerId: jest.fn().mockReturnValue('test-consumer'),
				isSharingEnabled: jest.fn().mockReturnValue(false),
				isLogStreamingEnabled: jest.fn().mockReturnValue(false),
				isLdapEnabled: jest.fn().mockReturnValue(false),
				isSamlEnabled: jest.fn().mockReturnValue(false),
				isAdvancedExecutionFiltersEnabled: jest.fn().mockReturnValue(false),
				isVariablesEnabled: jest.fn().mockReturnValue(false),
				isSourceControlLicensed: jest.fn().mockReturnValue(false),
				isExternalSecretsEnabled: jest.fn().mockReturnValue(false),
				isLicensed: jest.fn().mockReturnValue(false),
				isDebugInEditorLicensed: jest.fn().mockReturnValue(false),
				isWorkflowHistoryLicensed: jest.fn().mockReturnValue(false),
				isWorkerViewLicensed: jest.fn().mockReturnValue(false),
				isAdvancedPermissionsLicensed: jest.fn().mockReturnValue(false),
				isApiKeyScopesEnabled: jest.fn().mockReturnValue(false),
				getVariablesLimit: jest.fn().mockReturnValue(0),
				getTeamProjectLimit: jest.fn().mockReturnValue(0),
				isBinaryDataS3Licensed: jest.fn().mockReturnValue(false),
				isAiAssistantEnabled: jest.fn().mockReturnValue(false),
				isAskAiEnabled: jest.fn().mockReturnValue(false),
				isAiCreditsEnabled: jest.fn().mockReturnValue(false),
				getAiCredits: jest.fn().mockReturnValue(0),
				isFoldersEnabled: jest.fn().mockReturnValue(false),
			});

			const mailer = mock<UserManagementMailer>({
				isEmailSetUp: false,
			});

			const urlService = mock<UrlService>({
				getInstanceBaseUrl: jest.fn().mockReturnValue('http://localhost:5678'),
				getWebhookBaseUrl: jest.fn().mockReturnValue('http://localhost:5678'),
			});

			const securityConfig = mock<SecurityConfig>({
				blockFileAccessToauraFiles: false,
			});

			const pushConfig = mock<PushConfig>({
				backend: 'websocket',
			});

			const licenseState = mock<LicenseState>({
				isOidcLicensed: jest.fn().mockReturnValue(false),
				isMFAEnforcementLicensed: jest.fn().mockReturnValue(false),
				getMaxWorkflowsWithEvaluations: jest.fn().mockReturnValue(0),
			});

			const moduleRegistry = mock<ModuleRegistry>({
				getActiveModules: jest.fn().mockReturnValue([]),
			});

			const mfaService = mock<MfaService>({
				isMFAEnforced: jest.fn().mockReturnValue(false),
			});

			return new FrontendService(
				globalConfig,
				logger,
				loadNodesAndCredentials,
				credentialTypes,
				credentialsOverwrites,
				license,
				mailer,
				instanceSettings,
				urlService,
				securityConfig,
				pushConfig,
				binaryDataConfig,
				licenseState,
				moduleRegistry,
				mfaService,
			);
		};

		describe('collectEnvFeatureFlags', () => {
			it('should collect environment variables with aura_ENV_FEAT_ prefix', () => {
				process.env = {
					aura_ENV_FEAT_TEST_FLAG: 'true',
					aura_ENV_FEAT_ANOTHER_FLAG: 'false',
					aura_ENV_FEAT_NUMERIC_FLAG: '123',
					REGULAR_ENV_VAR: 'should-not-be-included',
					aura_OTHER_PREFIX: 'should-not-be-included',
				};

				const service = createMockService();
				const collectEnvFeatureFlags = (service as any).collectEnvFeatureFlags.bind(service);
				const result = collectEnvFeatureFlags();

				expect(result).toEqual({
					aura_ENV_FEAT_TEST_FLAG: 'true',
					aura_ENV_FEAT_ANOTHER_FLAG: 'false',
					aura_ENV_FEAT_NUMERIC_FLAG: '123',
				});
			});

			it('should return empty object when no aura_ENV_FEAT_ variables are set', () => {
				process.env = {
					REGULAR_ENV_VAR: 'value',
					aura_OTHER_PREFIX: 'value',
				};

				const service = createMockService();
				const collectEnvFeatureFlags = (service as any).collectEnvFeatureFlags.bind(service);
				const result = collectEnvFeatureFlags();

				expect(result).toEqual({});
			});

			it('should filter out undefined environment variable values', () => {
				process.env = {
					aura_ENV_FEAT_DEFINED_FLAG: 'true',
					aura_ENV_FEAT_UNDEFINED_FLAG: undefined,
				};

				const service = createMockService();
				const collectEnvFeatureFlags = (service as any).collectEnvFeatureFlags.bind(service);
				const result = collectEnvFeatureFlags();

				expect(result).toEqual({
					aura_ENV_FEAT_DEFINED_FLAG: 'true',
					// aura_ENV_FEAT_UNDEFINED_FLAG should be filtered out
				});
			});
		});

		describe('settings integration', () => {
			it('should include envFeatureFlags in initial settings', () => {
				process.env = {
					aura_ENV_FEAT_INIT_FLAG: 'true',
					aura_ENV_FEAT_ANOTHER_FLAG: 'false',
				};

				const service = createMockService();

				expect(service.settings.envFeatureFlags).toEqual({
					aura_ENV_FEAT_INIT_FLAG: 'true',
					aura_ENV_FEAT_ANOTHER_FLAG: 'false',
				});
			});

			it('should refresh envFeatureFlags when getSettings is called', () => {
				process.env = {
					aura_ENV_FEAT_INITIAL_FLAG: 'true',
				};

				const service = createMockService();

				// Verify initial state
				expect(service.settings.envFeatureFlags).toEqual({
					aura_ENV_FEAT_INITIAL_FLAG: 'true',
				});

				// Change environment
				process.env = {
					aura_ENV_FEAT_INITIAL_FLAG: 'false',
					aura_ENV_FEAT_NEW_FLAG: 'true',
				};

				// getSettings should refresh the flags
				const settings = service.getSettings();

				expect(settings.envFeatureFlags).toEqual({
					aura_ENV_FEAT_INITIAL_FLAG: 'false',
					aura_ENV_FEAT_NEW_FLAG: 'true',
				});
			});
		});
	});
});
