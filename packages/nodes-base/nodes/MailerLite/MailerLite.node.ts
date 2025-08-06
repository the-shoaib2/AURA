import type { INodeTypeBaseDescription, IVersionedNodeType } from 'aura-workflow';
import { VersionedNodeType } from 'aura-workflow';

import { MailerLiteV1 } from './v1/MailerLiteV1.node';
import { MailerLiteV2 } from './v2/MailerLiteV2.node';

export class MailerLite extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'MailerLite',
			name: 'mailerLite',
			icon: 'file:MailerLite.svg',
			group: ['input'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Consume MailerLite API',
			defaultVersion: 2,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new MailerLiteV1(baseDescription),
			2: new MailerLiteV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
