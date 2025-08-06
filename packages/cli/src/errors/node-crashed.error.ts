import type { INode } from 'aura-workflow';
import { NodeOperationError } from 'aura-workflow';

export class NodeCrashedError extends NodeOperationError {
	constructor(node: INode) {
		super(node, 'Node crashed, possible out-of-memory issue', {
			message: 'Execution stopped at this node',
			description:
				"aura may have run out of memory while running this execution. More context and tips on how to avoid this <a href='https://docsaurara.io/hosting/scaling/memory-errors/' target='_blank'>in the docs</a>",
		});
	}
}
