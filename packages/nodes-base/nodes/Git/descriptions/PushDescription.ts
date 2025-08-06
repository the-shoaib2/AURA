import type { INodeProperties } from 'aura-workflow';

export const pushFields: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['push'],
			},
		},
		placeholder: 'Add option',
		default: {},
		options: [
			{
				displayName: 'Target Repository',
				name: 'targetRepository',
				type: 'string',
				default: '',
				placeholder: 'https://github.com/the-shoaib2/aura',
				description: 'The URL or path of the repository to push to',
			},
		],
	},
];
