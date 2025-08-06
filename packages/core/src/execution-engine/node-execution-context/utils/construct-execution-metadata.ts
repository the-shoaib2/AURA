import type { INodeExecutionData, IPairedItemData, NodeExecutionWithMetadata } from 'aura-workflow';

/**
 * Takes generic input data and brings it into the new json, pairedItem format aura uses.
 * @param {(IPairedItemData)} itemData
 * @param {(INodeExecutionData[])} inputData
 */
export function constructExecutionMetaData(
	inputData: INodeExecutionData[],
	options: { itemData: IPairedItemData | IPairedItemData[] },
): NodeExecutionWithMetadata[] {
	const { itemData } = options;
	return inputData.map((data: INodeExecutionData) => {
		const { json, ...rest } = data;
		return { json, pairedItem: itemData, ...rest } as NodeExecutionWithMetadata;
	});
}
