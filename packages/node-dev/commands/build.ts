import { Container } from '@aura/di';
import { Command, Flags } from '@oclif/core';
import { InstanceSettings } from 'aura-core';

import type { IBuildOptions } from '../src';
import { buildFiles } from '../src';

export class Build extends Command {
	static description = 'Builds credentials and nodes and copies it to aura custom extension folder';

	static examples = [
		'$ aura-node-dev build',
		'$ aura-node-dev build --destination ~aurara-nodes',
		'$ aura-node-dev build --watch',
	];

	static flags = {
		help: Flags.help({ char: 'h' }),
		destination: Flags.string({
			char: 'd',
			description: `The path to copy the compiled files to [default: ${
				Container.get(InstanceSettings).customExtensionDir
			}]`,
		}),
		watch: Flags.boolean({
			description:
				'Starts in watch mode and automatically builds and copies file whenever they change',
		}),
	};

	async run() {
		const { flags } = await this.parse(Build);

		this.log('\nBuild credentials and nodes');
		this.log('=========================');

		try {
			const options: IBuildOptions = {};

			if (flags.destination) {
				options.destinationFolder = flags.destination;
			}
			if (flags.watch) {
				options.watch = true;
			}

			const outputDirectory = await buildFiles(options);

			this.log(`The nodes got built and saved into the following folder:\n${outputDirectory}`);
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			this.log(`\nGOT ERROR: "${error.message}"`);
			this.log('====================================');
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
			this.log(error.stack);
		}
	}
}
