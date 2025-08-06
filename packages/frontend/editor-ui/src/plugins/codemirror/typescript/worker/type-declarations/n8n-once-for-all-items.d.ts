export {};

declare global {
	interface NodeData<C = any, J extends auraJson = any, B extends string = string, P = any> {
		context: C;
		params: P;
		all(branchIndex?: number, runIndex?: number): Array<auraItem<J, B>>;
		first(branchIndex?: number, runIndex?: number): auraItem<J, B>;
		last(branchIndex?: number, runIndex?: number): auraItem<J, B>;
		itemMatching(itemIndex: number): auraItem<J, B>;
	}

	// @ts-expect-error auraInputJson is populated dynamically
	type auraInput = NodeData<auraInputContext, auraInputJson, auraInputBinaryKeys, auraInputParams>;
}
