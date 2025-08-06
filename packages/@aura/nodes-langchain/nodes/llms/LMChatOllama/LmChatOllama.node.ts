import type { ChatOllamaInput } from '@langchain/ollama';
import { ChatOllama } from '@langchain/ollama';
import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type ISupplyDataFunctions,
	type SupplyData,
} from 'aura-workflow';

import { getConnectionHintNoticeField } from '@utils/sharedFields';

import { ollamaModel, ollamaOptions, ollamaDescription } from '../LMOllama/description';
import { makeauraLlmFailedAttemptHandler } from '..auraraLlmFailedAttemptHandler';
import { auraLlmTracing } from '../auraLlmTracing';

export class LmChatOllama implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ollama Chat Model',

		name: 'lmChatOllama',
		icon: 'file:ollama.svg',
		group: ['transform'],
		version: 1,
		description: 'Language Model Ollama',
		defaults: {
			name: 'Ollama Chat Model',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Language Models', 'Root Nodes'],
				'Language Models': ['Chat Models (Recommended)'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.aura.io/integrations/builtin/cluster-nodes/sub-nodesaurara-nodes-langchain.lmchatollama/',
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
		const options = this.getNodeParameter('options', itemIndex, {}) as ChatOllamaInput;

		const model = new ChatOllama({
			...options,
			baseUrl: credentials.baseUrl as string,
			model: modelName,
			format: options.format === 'default' ? undefined : options.format,
			callbacks: [new auraLlmTracing(this)],
			onFailedAttempt: makeauraLlmFailedAttemptHandler(this),
		});

		return {
			response: model,
		};
	}
}
