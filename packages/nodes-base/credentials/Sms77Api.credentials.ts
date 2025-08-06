import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'aura-workflow';

export class Sms77Api implements ICredentialType {
	name = 'sms77Api';

	// eslint-disable-next-line aura-nodes-base/cred-class-field-display-name-miscased
	displayName = 'seven API';

	documentationUrl = 'sms77';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://gateway.seven.io/api',
			url: '/hooks',
			qs: {
				action: 'read',
			},
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'success',
					message: 'Invalid API Key',
					value: undefined,
				},
			},
		],
	};
}
