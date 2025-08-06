import type { BaseLanguageModel } from '@langchain/core/language_models/base';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { IExecuteFunctions } from 'aura-workflow';

import type { auraOutputParser } from '@utils/output_parsers/auraOutputParser';

/**
 * Interface for describing a message template in the UI
 */
export interface MessageTemplate {
	type: string;
	message: string;
	messageType: 'text' | 'imageBinary' | 'imageUrl';
	binaryImageDataKey?: string;
	imageUrl?: string;
	imageDetail?: 'auto' | 'low' | 'high';
}

/**
 * Parameters for prompt creation
 */
export interface PromptParams {
	context: IExecuteFunctions;
	itemIndex: number;
	llm: BaseLanguageModel | BaseChatModel;
	messages?: MessageTemplate[];
	formatInstructions?: string;
	query?: string;
}

/**
 * Parameters for chain execution
 */
export interface ChainExecutionParams {
	context: IExecuteFunctions;
	itemIndex: number;
	query: string;
	llm: BaseLanguageModel;
	outputParser?: auraOutputParser;
	messages?: MessageTemplate[];
	fallbackLlm?: BaseLanguageModel | null;
}
