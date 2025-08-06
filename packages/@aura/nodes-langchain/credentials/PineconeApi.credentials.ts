import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'aura-workflow';

export class PineconeApi implements ICredentialType {
	name = 'pineconeApi';

	displayName = 'PineconeApi';

	documentationUrl = 'pinecone';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Api-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.pinecone.io/indexes',
			headers: {
				accept: 'application/json; charset=utf-8',
			},
		},
	};
}
