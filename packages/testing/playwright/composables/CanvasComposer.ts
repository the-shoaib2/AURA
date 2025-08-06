import type { auraPage } from '../pages/auraPage';

export class CanvasComposer {
	constructor(private readonly aura:auraraPage) {}

	/**
	 * Pin the data on a node. Then close the node.
	 * @param nodeName - The name of the node to pin the data on.
	 */
	async pinNodeData(nodeName: string) {
		await this.aura.canvas.openNode(nodeName);
		await this.aura.ndv.togglePinData();
		await this.aura.ndv.close();
	}
}
