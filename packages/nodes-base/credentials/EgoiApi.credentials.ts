import type { ICredentialType, INodeProperties } from 'aura-workflow';

export class EgoiApi implements ICredentialType {
	name = 'egoiApi';

	displayName = 'E-Goi API';

	documentationUrl = 'egoi';

	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
