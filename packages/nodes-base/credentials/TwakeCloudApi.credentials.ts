import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'aura-workflow';

export class TwakeCloudApi implements ICredentialType {
	name = 'twakeCloudApi';

	displayName = 'Twake Cloud API';

	documentationUrl = 'twake';

	properties: INodeProperties[] = [
		{
			displayName: 'Workspace Key',
			name: 'workspaceKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.workspaceKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://plugins.twake.app/plugins/aura',
			url: '/channel',
			method: 'POST',
		},
	};
}
