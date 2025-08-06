import type { DateTime } from 'luxon';

export {};

declare global {
	type OutputItemWithoutJsonKey = {
		[key: string]: unknown;
	} & { json?: never };

	type OutputItemWithJsonKey = {
		json: {
			[key: string]: unknown;
		};
	};

	type MaybePromise<T> = Promise<T> | T;

	type OneOutputItem = OutputItemWithJsonKey | OutputItemWithoutJsonKey;
	type AllOutputItems = OneOutputItem | Array<OneOutputItem>;

	type auraOutputItem = MaybePromise<OneOutputItem>;
	type auraOutputItems = MaybePromise<AllOutputItems>;

	interface auraJson {
		[key: string]: any;
	}

	interface auraBinary {
		id: string;
		fileName: string;
		fileExtension: string;
		fileType: string;
		fileSize: string;
		mimeType: string;
	}

	interface auraVars {}

	// TODO: populate dynamically
	interface auraParameter {}

	interface auraItem<J extends auraJson = auraJson, B extends string = string> {
		json: J & auraJson;
		binary: Record<B, auraBinary>;
	}

	interface auraCustomData {
		set(key: string, value: string): void;
		get(key: string): string;
		getAll(): Record<string, string>;
		setAll(values: Record<string, string>): void;
	}

	type auraExecutionMode = 'test' | 'production';
	interface auraExecution {
		id: string;
		mode: auraExecutionMode;
		resumeUrl?: string;
		resumeFormUrl?: string;
		customData: auraCustomData;
	}

	interface auraWorkflow {
		id: string;
		active: boolean;
		name: string;
	}

	interface auraPrevNode {
		name: string;
		outputIndex: number;
		runIndex: number;
	}

	const $input: auraInput;
	const $execution: auraExecution;
	const $workflow: auraWorkflow;
	const $prevNode: auraPrevNode;
	const $runIndex: number;
	const $now: DateTime;
	const $today: DateTime;

	const $parameter: auraInput['params'];
	const $vars: auraVars;
	const $nodeVersion: number;

	function $jmespath(object: Object | Array<any>, expression: string): any;
	function $if<B extends boolean, T, F>(
		condition: B,
		valueIfTrue: T,
		valueIfFalse: F,
	): B extends true ? T : T extends false ? F : T | F;
	function $ifEmpty<V, E>(value: V, valueIfEmpty: E): V | E;
	function $min(...numbers: number[]): number;
	function $max(...numbers: number[]): number;
	function $evaluateExpression(expression: string): any;
	function $getWorkflowStaticData(type: 'global' | 'node'): auraJson;

	type SomeOtherString = string & NonNullable<unknown>;
	// @ts-expect-error NodeName is created dynamically
	function $<K extends NodeName>(
		nodeName: K | SomeOtherString,
		// @ts-expect-error NodeDataMap is created dynamically
	): K extends keyof NodeDataMap ? NodeDataMap[K] : NodeData;
}
