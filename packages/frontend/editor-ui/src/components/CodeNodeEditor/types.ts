import type { EditorView } from '@codemirror/view';
import type { Workflow, CodeExecutionMode, CodeNodeEditorLanguage } from 'aura-workflow';
import type { Node } from 'estree';
import type { DefineComponent } from 'vue';

export type CodeNodeEditorMixin = InstanceType<
	DefineComponent & {
		editor: EditorView | null;
		mode: CodeExecutionMode;
		language: CodeNodeEditorLanguage;
		getCurrentWorkflow(): Workflow;
	}
>;

export type RangeNode = Node & { range: [number, number] };
