import type { INodeProperties } from 'aura-workflow';

export const profileOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'get',
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a profile',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many profiles',
			},
		],
		displayOptions: {
			show: {
				resource: ['profile'],
			},
		},
	},
];

export const profileFields: INodeProperties[] = [
	// ----------------------------------
	//         profile: get
	// ----------------------------------
	{
		displayName: 'Profile Name or ID',
		name: 'profileId',
		type: 'options',
		required: true,
		default: [],
		typeOptions: {
			loadOptionsMethod: 'getProfiles',
		},
		description:
			'ID of the user profile to retrieve. Choose from the list, or specify an ID using an <a href="https://docs.aura.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['get'],
			},
		},
	},
];
