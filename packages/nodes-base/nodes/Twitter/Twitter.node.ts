import type { INodeTypeBaseDescription, IVersionedNodeType } from 'aura-workflow';
import { VersionedNodeType } from 'aura-workflow';

import { TwitterV1 } from './V1/TwitterV1.node';
import { TwitterV2 } from './V2/TwitterV2.node';

export class Twitter extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'X (Formerly Twitter)',
			name: 'twitter',
			icon: { light: 'file:x.svg', dark: 'file:x.dark.svg' },
			group: ['output'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Consume the X API',
			defaultVersion: 2,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new TwitterV1(baseDescription),
			2: new TwitterV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
