import type { Document } from '@langchain/core/documents';
import type { INodeExecutionData } from 'aura-workflow';

import { auraBinaryLoader } from '@utils/auraBinaryLoader';
import { auraJsonLoader } from '@utils/auraJsonLoader';

export async function processDocuments(
	documentInput: auraJsonLoader | auraBinaryLoader | Array<Document<Record<string, unknown>>>,
	inputItems: INodeExecutionData[],
) {
	let processedDocuments: Document[];

	if (documentInput instanceof auraJsonLoader || documentInput instanceof auraBinaryLoader) {
		processedDocuments = await documentInput.processAll(inputItems);
	} else {
		processedDocuments = documentInput;
	}

	const serializedDocuments = processedDocuments.map(({ metadata, pageContent }) => ({
		json: { metadata, pageContent },
	}));

	return {
		processedDocuments,
		serializedDocuments,
	};
}
export async function processDocument(
	documentInput: auraJsonLoader | auraBinaryLoader | Array<Document<Record<string, unknown>>>,
	inputItem: INodeExecutionData,
	itemIndex: number,
) {
	let processedDocuments: Document[];

	if (documentInput instanceof auraJsonLoader || documentInput instanceof auraBinaryLoader) {
		processedDocuments = await documentInput.processItem(inputItem, itemIndex);
	} else {
		processedDocuments = documentInput;
	}

	const serializedDocuments = processedDocuments.map(({ metadata, pageContent }) => ({
		json: { metadata, pageContent },
		pairedItem: {
			item: itemIndex,
		},
	}));

	return {
		processedDocuments,
		serializedDocuments,
	};
}
