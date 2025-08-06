export {};

declare global {
	interface NodeData<C, J extends auraJson, B extends string, P> {
		context: C;
		item: auraItem<J, B>;
		params: P;
	}

	// @ts-expect-error auraInputJson is populated dynamically
	type auraInput = NodeData<{}, auraInputJson, {}, {}>;

	const $itemIndex: number;
	const $json: auraInput['item']['json'];
	const $binary: auraInput['item']['binary'];
}
