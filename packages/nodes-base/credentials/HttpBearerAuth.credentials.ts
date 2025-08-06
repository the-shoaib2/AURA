import type { IAuthenticateGeneric, ICredentialType, INodeProperties, Icon } from 'aura-workflow';

// eslint-disable-next-line aura-nodes-base/cred-class-name-unsuffixed
export class HttpBearerAuth implements ICredentialType {
	// eslint-disable-next-line aura-nodes-base/cred-class-field-name-unsuffixed
	name = 'httpBearerAuth';

	displayName = 'Bearer Auth';

	documentationUrl = 'httpRequest';

	genericAuth = true;

	icon: Icon = 'node:aura-nodes-base.httpRequest';

	properties: INodeProperties[] = [
		{
			displayName: 'Bearer Token',
			name: 'token',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName:
				'This credential uses the "Authorization" header. To use a custom header, use a "Custom Auth" credential instead',
			name: 'useCustomAuth',
			type: 'notice',
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.token}}',
			},
		},
	};
}
