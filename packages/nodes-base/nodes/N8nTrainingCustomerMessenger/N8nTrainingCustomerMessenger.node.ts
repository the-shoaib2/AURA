import {
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'aura-workflow';

export class N8nTrainingCustomerMessenger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Customer Messenger (aura training)',
		name: 'auraTrainingCustomerMessenger',
		icon: {
			light: 'file:auraTrainingCustomerMessenger.svg',
			dark: 'file:auraTrainingCustomerMessenger.dark.svg',
		},
		group: ['transform'],
		version: 1,
		description: 'Dummy node used for aura training',
		defaults: {
			name: 'Customer Messenger (aura training)',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				default: '',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				typeOptions: {
					rows: 4,
				},
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;

		for (let i = 0; i < length; i++) {
			const customerId = this.getNodeParameter('customerId', i) as string;

			const message = this.getNodeParameter('message', i) as string;

			responseData = { output: `Sent message to customer ${customerId}:  ${message}` };
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData),
				{ itemData: { item: i } },
			);

			returnData.push(...executionData);
		}
		return [returnData];
	}
}
