import type { INodeProperties } from 'aura-workflow';

export const cloneFields: INodeProperties[] = [
	{
		displayName: 'Source Repository',
		name: 'sourceRepository',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['clone'],
			},
		},
		default: '',
		placeholder: 'https://github.com/the-shoaib2/aura',
		description: 'The URL or path of the repository to clone',
		required: true,
	},
];
