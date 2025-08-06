import { createEventBus } from '@aura/utils/event-bus';
import type { IPinData } from 'aura-workflow';

export type DataPinningDiscoveryEvent = {
	isTooltipVisible: boolean;
};

export type UnpinNodeDataEvent = {
	nodeNames: string[];
};

export interface DataPinningEventBusEvents {
	/** Command to show or hide the data pinning discovery tooltip */
	'data-pinning-discovery': DataPinningDiscoveryEvent;

	/** Event that data has been pinned for workflow */
	'pin-data': IPinData;

	/** Event that data has been unpinned for specific nodes */
	'unpin-data': UnpinNodeDataEvent;
}

export const dataPinningEventBus = createEventBus<DataPinningEventBusEvents>();
