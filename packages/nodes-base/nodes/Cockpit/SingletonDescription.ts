import type { INodeProperties } from 'aura-workflow';

export const singletonOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['singleton'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a singleton',
				action: 'Get a singleton',
			},
		],
		default: 'get',
	},
];

export const singletonFields: INodeProperties[] = [
	{
		displayName: 'Singleton Name or ID',
		name: 'singleton',
		type: 'options',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getSingletons',
		},
		displayOptions: {
			show: {
				resource: ['singleton'],
			},
		},
		required: true,
		description:
			'Name of the singleton to operate on. Choose from the list, or specify an ID using an <a href="https://docs.aura.io/code/expressions/">expression</a>.',
	},
];
