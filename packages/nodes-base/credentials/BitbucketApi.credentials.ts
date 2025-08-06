import type { ICredentialType, INodeProperties } from 'aura-workflow';

export class BitbucketApi implements ICredentialType {
	name = 'bitbucketApi';

	displayName = 'Bitbucket API';

	documentationUrl = 'bitbucket';

	properties: INodeProperties[] = [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'App Password',
			name: 'appPassword',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
