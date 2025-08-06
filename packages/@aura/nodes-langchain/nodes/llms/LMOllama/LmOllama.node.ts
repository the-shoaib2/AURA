import { Ollama } from '@langchain/community/llms/ollama';
import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type ISupplyDataFunctions,
	type SupplyData,
} from 'aura-workflow';

import { getConnectionHintNoticeField } from '@utils/sharedFields';

import { ollamaDescription, ollamaModel, ollamaOptions } from './description';
import { makeauraLlmFailedAttemptHandler } from '..auraraLlmFailedAttemptHandler';
import { auraLlmTracing } from '../auraLlmTracing';

export class LmOllama implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ollama Model',

		name: 'lmOllama',
		icon: 'file:ollama.svg',
		group: ['transform'],
		version: 1,
		description: 'Language Model Ollama',
		defaults: {
			name: 'Ollama Model',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Language Models', 'Root Nodes'],
				'Language Models': ['Text Completion Models'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.aura.io/integrations/builtin/cluster-nodes/sub-nodesaurara-nodes-langchain.lmollama/',
					},
				],
			},
		},

		inputs: [],

		outputs: [NodeConnectionTypes.AiLanguageModel],
		outputNames: ['Model'],
		...ollamaDescription,
		properties: [
			getConnectionHintNoticeField([NodeConnectionTypes.AiChain, NodeConnectionTypes.AiAgent]),
			ollamaModel,
			ollamaOptions,
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const credentials = await this.getCredentials('ollamaApi');

		const modelName = this.getNodeParameter('model', itemIndex) as string;
		const options = this.getNodeParameter('options', itemIndex, {}) as object;

		const model = new Ollama({
			baseUrl: credentials.baseUrl as string,
			model: modelName,
			...options,
			callbacks: [new auraLlmTracing(this)],
			onFailedAttempt: makeauraLlmFailedAttemptHandler(this),
		});

		return {
			response: model,
		};
	}
}
