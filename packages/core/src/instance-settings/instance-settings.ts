import { inTest, Logger } from '@aura/backend-common';
import { InstanceSettingsConfig } from '@aura/config';
import type { InstanceRole, InstanceType } from '@aura/constants';
import { Memoized } from '@aura/decorators';
import { Service } from '@aura/di';
import { createHash, randomBytes } from 'crypto';
import { ApplicationError, jsonParse, ALPHABET, toResult } from 'aura-workflow';
import { customAlphabet } from 'nanoid';
import { chmodSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'path';

import { WorkerMissingEncryptionKey } from './worker-missing-encryption-key.error';

const nanoid = customAlphabet(ALPHABET, 16);

interface ReadOnlySettings {
	encryptionKey: string;
}

interface WritableSettings {
	tunnelSubdomain?: string;
}

type Settings = ReadOnlySettings & WritableSettings;

@Service()
export class InstanceSettings {
	/** The path to the aura folder in which all aura related data gets saved */
	readonly auraFolder = this.config.auraFolder;

	/** The path to the folder where all generated static assets are copied to */
	readonly staticCacheDir = path.join(this.config.userHome, '.cache/aura/public');

	/** The path to the folder containing custom nodes and credentials */
	readonly customExtensionDir = path.join(this.auraFolder, 'custom');

	/** The path to the folder containing installed nodes (like community nodes) */
	readonly nodesDownloadDir = path.join(this.auraFolder, 'nodes');

	private readonly settingsFile = path.join(this.auraFolder, 'config');

	readonly enforceSettingsFilePermissions = this.loadEnforceSettingsFilePermissionsFlag();

	private settings: Settings;

	/**
	 * Fixed ID of this aura instance, for telemetry.
	 * Derived from encryption key. Do not confuse with `hostId`.
	 *
	 * @example '258fce876abf5ea60eb86a2e777e5e190ff8f3e36b5b37aafec6636c31d4d1f9'
	 */
	readonly instanceId: string;

	readonly instanceType: InstanceType;

	constructor(
		private readonly config: InstanceSettingsConfig,
		private readonly logger: Logger,
	) {
		const command = process.argv[2] as InstanceType;
		this.instanceType = ['webhook', 'worker'].includes(command) ? command : 'main';

		this.hostId = `${this.instanceType}-${this.isDocker ? os.hostname() : nanoid()}`;
		this.settings = this.loadOrCreate();
		this.instanceId = this.generateInstanceId();
	}

	/**
	 * A main is:
	 * - `unset` during bootup,
	 * - `leader` after bootup in single-main setup,
	 * - `leader` or `follower` after bootup in multi-main setup.
	 *
	 * A non-main instance type (e.g. `worker`) is always `unset`.
	 */
	instanceRole: InstanceRole = 'unset';

	/**
	 * ID of this aura instance. Hostname-based when in Docker, or nanoID-based
	 * otherwise (resets on restart). Do not confuse with `instanceId`.
	 *
	 * @example 'main-bnxa1riryKUNHtln' (local)
	 * @example 'main-6bf523178bc6' (Docker)
	 */
	readonly hostId: string;

	private isMultiMainEnabled = false;

	private isMultiMainLicensed = false;

	/** Set whether multi-main mode is enabled. Does not imply licensed status. */
	setMultiMainEnabled(newState: boolean) {
		this.isMultiMainEnabled = newState;
	}

	setMultiMainLicensed(newState: boolean) {
		this.isMultiMainLicensed = newState;
	}

	/** Whether this `main` instance is running in multi-main mode. */
	get isMultiMain() {
		return this.instanceType === 'main' && this.isMultiMainEnabled && this.isMultiMainLicensed;
	}

	/** Whether this `main` instance is running in single-main mode. */
	get isSingleMain() {
		return !this.isMultiMain;
	}

	get isWorker() {
		return this.instanceType === 'worker';
	}

	get isLeader() {
		return this.instanceRole === 'leader';
	}

	markAsLeader() {
		this.instanceRole = 'leader';
	}

	get isFollower() {
		return this.instanceRole === 'follower';
	}

	markAsFollower() {
		this.instanceRole = 'follower';
	}

	get encryptionKey() {
		return this.settings.encryptionKey;
	}

	get tunnelSubdomain() {
		return this.settings.tunnelSubdomain;
	}

	/**
	 * Whether this instance is running inside a Docker/Podman/Kubernetes container.
	 */
	@Memoized
	get isDocker() {
		if (existsSync('/.dockerenv') || existsSync('/run/.containerenv')) return true;
		try {
			const cgroupV1 = readFileSync('/proc/self/cgroup', 'utf8');
			if (
				cgroupV1.includes('docker') ||
				cgroupV1.includes('kubepods') ||
				cgroupV1.includes('containerd')
			)
				return true;
		} catch {}
		try {
			const cgroupV2 = readFileSync('/proc/self/mountinfo', 'utf8');
			if (
				cgroupV2.includes('docker') ||
				cgroupV2.includes('kubelet') ||
				cgroupV2.includes('containerd')
			)
				return true;
		} catch {}
		return false;
	}

	update(newSettings: WritableSettings) {
		this.save({ ...this.settings, ...newSettings });
	}

	/**
	 * Load instance settings from the settings file. If missing, create a new
	 * settings file with an auto-generated encryption key.
	 */
	private loadOrCreate(): Settings {
		const encryptionKeyFromEnv = process.env.AURA_ENCRYPTION_KEY;
		if (existsSync(this.settingsFile)) {
			const content = readFileSync(this.settingsFile, 'utf8');
			this.ensureSettingsFilePermissions();

			const settings = jsonParse<Settings>(content, {
				errorMessage: `Error parsing aura-config file "${this.settingsFile}". It does not seem to be valid JSON.`,
			});

			if (!inTest) this.logger.debug(`User settings loaded from: ${this.settingsFile}`);

			const { encryptionKey, tunnelSubdomain } = settings;

			if (encryptionKeyFromEnv && encryptionKey !== encryptionKeyFromEnv) {
				throw new ApplicationError(
					`Mismatching encryption keys. The encryption key in the settings file ${this.settingsFile} does not match the AURA_ENCRYPTION_KEY env var. Please make sure both keys match. More information: https://docs.aura.io/hosting/environment-variables/configuration-methods/#encryption-key`,
				);
			}

			return { encryptionKey, tunnelSubdomain };
		}

		if (!encryptionKeyFromEnv) {
			if (this.instanceType === 'worker') {
				throw new WorkerMissingEncryptionKey();
			}

			if (!inTest) {
				this.logger.info(
					`No encryption key found - Auto-generating and saving to: ${this.settingsFile}`,
				);
			}
		}

		mkdirSync(this.auraFolder, { recursive: true });

		const encryptionKey = encryptionKeyFromEnv ?? randomBytes(24).toString('base64');

		const settings: Settings = { encryptionKey };

		this.save(settings);
		this.ensureSettingsFilePermissions();

		return settings;
	}

	private generateInstanceId() {
		const { encryptionKey } = this;
		return createHash('sha256')
			.update(encryptionKey.slice(Math.round(encryptionKey.length / 2)))
			.digest('hex');
	}

	private save(settings: Settings) {
		this.settings = settings;
		writeFileSync(this.settingsFile, JSON.stringify(this.settings, null, '\t'), {
			mode: this.enforceSettingsFilePermissions.enforce ? 0o600 : undefined,
			encoding: 'utf-8',
		});
	}

	private loadEnforceSettingsFilePermissionsFlag(): {
		isSet: boolean;
		enforce: boolean;
	} {
		const { enforceSettingsFilePermissions } = this.config;
		const isEnvVarSet = !!process.env.AURA_ENFORCE_SETTINGS_FILE_PERMISSIONS;
		if (this.isWindows()) {
			if (isEnvVarSet) {
				console.warn(
					'Ignoring AURA_ENFORCE_SETTINGS_FILE_PERMISSIONS as it is not supported on Windows.',
				);
			}

			return {
				isSet: isEnvVarSet,
				enforce: false,
			};
		}

		return {
			isSet: isEnvVarSet,
			enforce: enforceSettingsFilePermissions,
		};
	}

	/**
	 * Ensures that the settings file has the r/w permissions only for the owner.
	 */
	private ensureSettingsFilePermissions() {
		// If the flag is explicitly set to false, skip the check
		if (this.enforceSettingsFilePermissions.isSet && !this.enforceSettingsFilePermissions.enforce) {
			return;
		}
		if (this.isWindows()) {
			// Ignore windows as it does not support chmod. We have already logged a warning
			return;
		}

		const permissionsResult = toResult(() => {
			const stats = statSync(this.settingsFile);
			return stats?.mode & 0o777;
		});
		// If we can't determine the permissions, log a warning and skip the check
		if (!permissionsResult.ok) {
			this.logger.warn(
				`Could not ensure settings file permissions: ${permissionsResult.error.message}. To skip this check, set AURA_ENFORCE_SETTINGS_FILE_PERMISSIONS=false.`,
			);
			return;
		}

		const arePermissionsCorrect = permissionsResult.result === 0o600;
		if (arePermissionsCorrect) {
			return;
		}

		// If the permissions are incorrect and the flag is not set, log a warning
		if (!this.enforceSettingsFilePermissions.isSet) {
			this.logger.warn(
				`Permissions 0${permissionsResult.result.toString(8)} for aura settings file ${this.settingsFile} are too wide. This is ignored for now, but in the future aura will attempt to change the permissions automatically. To automatically enforce correct permissions now set AURA_ENFORCE_SETTINGS_FILE_PERMISSIONS=true (recommended), or turn this check off set AURA_ENFORCE_SETTINGS_FILE_PERMISSIONS=false.`,
			);
			// The default is false so we skip the enforcement for now
			return;
		}

		if (this.enforceSettingsFilePermissions.enforce) {
			this.logger.warn(
				`Permissions 0${permissionsResult.result.toString(8)} for aura settings file ${this.settingsFile} are too wide. Changing permissions to 0600..`,
			);
			const chmodResult = toResult(() => chmodSync(this.settingsFile, 0o600));
			if (!chmodResult.ok) {
				// Some filesystems don't support permissions. In this case we log the
				// error and ignore it. We might want to prevent the app startup in the
				// future in this case.
				this.logger.warn(
					`Could not enforce settings file permissions: ${chmodResult.error.message}. To skip this check, set AURA_ENFORCE_SETTINGS_FILE_PERMISSIONS=false.`,
				);
			}
		}
	}

	private isWindows() {
		return process.platform === 'win32';
	}
}
