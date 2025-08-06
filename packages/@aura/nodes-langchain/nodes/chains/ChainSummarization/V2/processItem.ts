import type { Document } from '@langchain/core/documents';
import type { BaseLanguageModel } from '@langchain/core/language_models/base';
import type { ChainValues } from '@langchain/core/utils/types';
import { RecursiveCharacterTextSplitter, type TextSplitter } from '@langchain/textsplitters';
import { loadSummarizationChain } from 'langchain/chains';
import { type IExecuteFunctions, type INodeExecutionData, NodeConnectionTypes } from 'aura-workflow';

import { auraBinaryLoader } from '@utils/auraBinaryLoader';
import { auraJsonLoader } from '@utils/auraJsonLoader';
import { getTracingConfig } from '@utils/tracing';

import { getChainPromptsArgs } from '../helpers';

export async function processItem(
	ctx: IExecuteFunctions,
	itemIndex: number,
	item: INodeExecutionData,
	operationMode: string,
	chunkingMode: 'simple' | 'advanced' | 'none',
): Promise<ChainValues | undefined> {
	const model = (await ctx.getInputConnectionData(
		NodeConnectionTypes.AiLanguageModel,
		0,
	)) as BaseLanguageModel;

	const summarizationMethodAndPrompts = ctx.getNodeParameter(
		'options.summarizationMethodAndPrompts.values',
		itemIndex,
		{},
	) as {
		prompt?: string;
		refineQuestionPrompt?: string;
		refinePrompt?: string;
		summarizationMethod: 'map_reduce' | 'stuff' | 'refine';
		combineMapPrompt?: string;
	};

	const chainArgs = getChainPromptsArgs(
		summarizationMethodAndPrompts.summarizationMethod ?? 'map_reduce',
		summarizationMethodAndPrompts,
	);

	const chain = loadSummarizationChain(model, chainArgs);

	let processedDocuments: Document[];

	// Use dedicated document loader input to load documents
	if (operationMode === 'documentLoader') {
		const documentInput = (await ctx.getInputConnectionData(NodeConnectionTypes.AiDocument, 0)) as
			| auraJsonLoader
			| Array<Document<Record<string, unknown>>>;

		const isauraLoader =
			documentInput instanceof auraJsonLoader || documentInput instanceof auraBinaryLoader;

		processedDocuments = isauraLoader
			? await documentInput.processItem(item, itemIndex)
			: documentInput;

		return await chain.withConfig(getTracingConfig(ctx)).invoke({
			input_documents: processedDocuments,
		});
	} else if (['nodeInputJson', 'nodeInputBinary'].includes(operationMode)) {
		// Take the input and use binary or json loader
		let textSplitter: TextSplitter | undefined;

		switch (chunkingMode) {
			// In simple mode we use recursive character splitter with default settings
			case 'simple':
				const chunkSize = ctx.getNodeParameter('chunkSize', itemIndex, 1000) as number;
				const chunkOverlap = ctx.getNodeParameter('chunkOverlap', itemIndex, 200) as number;

				textSplitter = new RecursiveCharacterTextSplitter({ chunkOverlap, chunkSize });
				break;

			// In advanced mode user can connect text splitter node so we just retrieve it
			case 'advanced':
				textSplitter = (await ctx.getInputConnectionData(NodeConnectionTypes.AiTextSplitter, 0)) as
					| TextSplitter
					| undefined;
				break;
			default:
				break;
		}

		let processor: auraJsonLoader | auraBinaryLoader;
		if (operationMode === 'nodeInputBinary') {
			const binaryDataKey = ctx.getNodeParameter(
				'options.binaryDataKey',
				itemIndex,
				'data',
			) as string;
			processor = new auraBinaryLoader(ctx, 'options.', binaryDataKey, textSplitter);
		} else {
			processor = new auraJsonLoader(ctx, 'options.', textSplitter);
		}

		const processedItem = await processor.processItem(item, itemIndex);
		return await chain.invoke(
			{
				input_documents: processedItem,
			},
			{ signal: ctx.getExecutionCancelSignal() },
		);
	}
	return undefined;
}
