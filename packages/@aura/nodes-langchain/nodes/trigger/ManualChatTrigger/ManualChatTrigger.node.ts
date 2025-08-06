import {
	type ITriggerFunctions,
	type INodeType,
	type INodeTypeDescription,
	type ITriggerResponse,
	NodeConnectionTypes,
} from 'aura-workflow';

export class ManualChatTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Manual Chat Trigger',
		name: 'manualChatTrigger',
		icon: 'fa:comments',
		group: ['trigger'],
		version: [1, 1.1],
		description: 'Runs the flow on new manual chat message',
		eventTriggerDescription: '',
		maxNodes: 1,
		hidden: true,
		defaults: {
			name: 'When chat message received',
			color: '#909298',
		},
		codex: {
			categories: ['Core Nodes'],
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.aura.io/integrations/builtin/core-nodesaurara-nodes-langchain.chattrigger/',
					},
				],
			},
			subcategories: {
				'Core Nodes': ['Other Trigger Nodes'],
			},
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName:
					'This node is where a manual chat workflow execution starts. To make one, go back to the canvas and click ‘Chat’',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				// eslint-disable-next-line aura-nodes-base/node-param-display-name-miscased
				displayName: 'Chat and execute workflow',
				name: 'openChat',
				type: 'button',
				typeOptions: {
					buttonConfig: {
						action: 'openChat',
					},
				},
				default: '',
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const manualTriggerFunction = async () => {
			this.emit([this.helpers.returnJsonArray([{}])]);
		};

		return {
			manualTriggerFunction,
		};
	}
}
