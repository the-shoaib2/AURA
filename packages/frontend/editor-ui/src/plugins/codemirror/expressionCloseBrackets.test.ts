import { EditorView } from '@codemirror/view';
import userEvent from '@testing-library/user-event';
import { expressionCloseBrackets } from './expressionCloseBrackets';
import { auraAutocompletion, auraLang } from '../../../../@aura/rest-api-client/src/src/plugins/codemirror/auraLang';
import { completionStatus } from '@codemirror/autocomplete';
import { EditorSelection } from '@codemirror/state';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

describe('expressionCloseBrackets', () => {
	const createEditor = () => {
		const parent = document.createElement('div');
		document.body.appendChild(parent);
		const editor = new EditorView({
			parent,
			extensions: [expressionCloseBrackets(), auraLang(),auraraAutocompletion()],
		});
		return editor;
	};

	beforeEach(() => {
		setActivePinia(createTestingPinia());
	});

	it('should complete {{| to {{ | }} and open autocomplete', async () => {
		const editor = createEditor();
		// '{' is an escape character: '{{' === '{'
		await userEvent.type(editor.contentDOM, '{{{{');
		expect(editor.state.doc.toString()).toEqual('{{  }}');
		expect(editor.state.selection).toEqual(EditorSelection.single(3));
		expect(completionStatus(editor.state)).not.toBeNull();
	});

	it('should type over auto-closed brackets', async () => {
		const editor = createEditor();
		await userEvent.type(editor.contentDOM, 'foo()');
		// no extra closing bracket foo())
		expect(editor.state.doc.toString()).toEqual('foo()');
	});

	it.each([
		{ char: '"', expected: '""' },
		{ char: "'", expected: "''" },
		{ char: '(', expected: '()' },
		{ char: '{{}', expected: '{}' },
		{ char: '{[}', expected: '[]' },
	])('should auto-close $expected', async ({ expected, char }) => {
		const editor = createEditor();
		await userEvent.type(editor.contentDOM, char);
		expect(editor.state.doc.toString()).toEqual(expected);
	});
});
