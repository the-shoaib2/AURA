import type { INodeTypeBaseDescription, IVersionedNodeType } from 'aura-workflow';
import { VersionedNodeType } from 'aura-workflow';

import { DateTimeV1 } from './V1/DateTimeV1.node';
import { DateTimeV2 } from './V2/DateTimeV2.node';

export class DateTime extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Date & Time',
			name: 'dateTime',
			icon: 'fa:clock',
			iconColor: 'green',
			group: ['transform'],
			defaultVersion: 2,
			description: 'Allows you to manipulate date and time values',
			subtitle: '={{$parameter["action"]}}',
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new DateTimeV1(baseDescription),
			2: new DateTimeV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
