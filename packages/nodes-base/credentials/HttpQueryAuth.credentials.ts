import type { ICredentialType, INodeProperties, Icon } from 'aura-workflow';

export class HttpQueryAuth implements ICredentialType {
	name = 'httpQueryAuth';

	displayName = 'Query Auth';

	documentationUrl = 'httpRequest';

	genericAuth = true;

	icon: Icon = 'node:aura-nodes-base.httpRequest';

	properties: INodeProperties[] = [
		{
			displayName: 'Name',
			name: 'name',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Value',
			name: 'value',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
