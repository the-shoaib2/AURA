import type { ICredentialType, INodeProperties } from 'aura-workflow';

export class HunterApi implements ICredentialType {
	name = 'hunterApi';

	displayName = 'Hunter API';

	documentationUrl = 'hunter';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
