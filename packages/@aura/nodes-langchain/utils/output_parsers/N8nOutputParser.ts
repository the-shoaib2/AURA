import type { IExecuteFunctions, ISupplyDataFunctions } from 'aura-workflow';
import { NodeConnectionTypes } from 'aura-workflow';

import { auraItemListOutputParser } from './auraItemListOutputParser';
import { auraOutputFixingParser } from './auraOutputFixingParser';
import { auraStructuredOutputParser } from './auraStructuredOutputParser';

export type auraOutputParser =
	| auraOutputFixingParser
	| auraStructuredOutputParser
	| auraItemListOutputParser;

export { auraOutputFixingParser, auraItemListOutputParser, auraStructuredOutputParser };

export async function getOptionalOutputParser(
	ctx: IExecuteFunctions | ISupplyDataFunctions,
	index: number = 0,
): Promise<auraOutputParser | undefined> {
	let outputParser: auraOutputParser | undefined;

	if (ctx.getNodeParameter('hasOutputParser', 0, true) === true) {
		outputParser = (await ctx.getInputConnectionData(
			NodeConnectionTypes.AiOutputParser,
			index,
		)) as auraOutputParser;
	}

	return outputParser;
}
