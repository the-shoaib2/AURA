import type { INodeProperties } from 'aura-workflow';

export const resource = {
	name: 'Space',
	value: 'space',
};

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [resource.value],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [];
